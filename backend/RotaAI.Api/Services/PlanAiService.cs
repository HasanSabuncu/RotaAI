// backend/RotaAI.Api/Services/PlanAiService.cs
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using RotaAI.Api.Models;

namespace RotaAI.Api.Services;

public sealed class PlanAiService
{
    private readonly GooglePlacesService _placesService;
    private readonly HttpClient _httpClient;
    private readonly string _openAiApiKey;

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public PlanAiService(
        GooglePlacesService placesService,
        IHttpClientFactory httpClientFactory,
        IConfiguration cfg)
    {
        _placesService = placesService;
        _httpClient = httpClientFactory.CreateClient("openai");
        _openAiApiKey = cfg["OPENAI_API_KEY"]
            ?? throw new InvalidOperationException("OPENAI_API_KEY missing");
    }

    public async Task<PlanResponseDto> GeneratePlanAsync(PlanRequestDto request)
    {
        // 1) Kullanıcı konumuna göre mekanları çek
        var places = await _placesService.GetMuseumsAsync(
            request.StartLat,
            request.StartLng
        );

        // 2) Candidate listeyi kural tabanlı süz
        var filtered = FilterCandidates(places, request);

        if (filtered.Count == 0)
        {
            throw new InvalidOperationException("Yeterli uygun mekan bulunamadı.");
        }

        // 3) GPT için prompt hazırla
        var sysPrompt = BuildSystemPrompt();
        var userPrompt = BuildUserPrompt(request, filtered);

        // 4) OpenAI Chat Completions çağrısı
        var body = new
        {
            model = "gpt-4.1-mini", // istersen "gpt-4.1" / başka model yapabilirsin
            messages = new[]
            {
                new { role = "system", content = sysPrompt },
                new { role = "user",   content = userPrompt }
            },
            // JSON formatı zorunlu
            response_format = new { type = "json_object" }
        };

        var httpReq = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/chat/completions")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(body, JsonOpts),
                Encoding.UTF8,
                "application/json")
        };

        httpReq.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", _openAiApiKey);

        using var resp = await _httpClient.SendAsync(httpReq);
        if (!resp.IsSuccessStatusCode)
        {
            var errorText = await resp.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"OpenAI error: {resp.StatusCode} - {errorText}");
        }

        using var json = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());

        var content = json.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        if (string.IsNullOrWhiteSpace(content))
            throw new InvalidOperationException("OpenAI boş içerik döndürdü.");

        // 5) GPT’nin döndürdüğü JSON’u PlanResponseDto’ya deserialize et
        var plan = JsonSerializer.Deserialize<PlanResponseDto>(content, JsonOpts)
                   ?? throw new InvalidOperationException("Plan parse edilemedi.");

        // Güvenlik: çok saçma sonuçlar olursa toparlamak için birkaç basit check
        plan.Stops = plan.Stops
            .OrderBy(s => s.Order)
            .Take(20)
            .ToList();

        return plan;
    }

    private static List<PlaceListItemDto> FilterCandidates(
        IReadOnlyList<PlaceListItemDto> places,
        PlanRequestDto req)
    {
        var interestSet = req.Interests.Select(i => i.ToLowerInvariant()).ToHashSet();

        // interest -> category mapping
        string MapInterestToCategory(string interest) => interest switch
        {
            "history" => "historical",
            "nature" => "nature",
            "gastronomy" => "gastronomy",
            "art" => "art",
            "shopping" => "shopping",
            "family" => "family",
            "romantic" => "romantic",
            _ => ""
        };

        var targetCats = interestSet
            .Select(MapInterestToCategory)
            .Where(c => !string.IsNullOrEmpty(c))
            .ToHashSet();

        // Yoğunluğa göre durak sayısı
        int maxStops = req.Intensity switch
        {
            "relaxed" => 4,
            "intensive" => 8,
            _ => 6 // moderate
        };

        // Bölge + yoğunluğa göre mesafe limiti
        string region = string.IsNullOrWhiteSpace(req.Region) ? "nearby" : req.Region;

        double maxDistKm;
        if (region == "nearby")
        {
            // KONUMUMA YAKIN MODU
            maxDistKm = req.Intensity switch
            {
                "relaxed" => 4,   // çok yakın
                "intensive" => 10,  // biraz aç
                _ => 6    // orta tempo
            };
        }
        else
        {
            // İZMİR GENELİ MODU
            maxDistKm = req.Intensity switch
            {
                "relaxed" => 12,
                "intensive" => 40,
                _ => 25
            };
        }

        // Minimum puan: 4.0 ve üzerini tercih et
        const double minRating = 4.0;

        var q = places
            .Where(p => p.DistanceKm <= maxDistKm && p.Rating >= minRating);

        if (targetCats.Count > 0)
        {
            q = q.Where(p => targetCats.Contains(p.Category));
        }

        // Önce en yüksek puan, sonra en yakın
        return q
            .OrderByDescending(p => p.Rating)
            .ThenBy(p => p.DistanceKm)
            .Take(maxStops * 3) // GPT’ye fazla aday ver, kendisi seçsin
            .ToList();
    }

    private static string BuildSystemPrompt()
    {
        return @"
Sen bir rota planlama yapay zekasısın. Görevin:

- Kullanıcının süre, yoğunluk ve ilgi alanlarına göre
- Sana verilen mekan listesinden
- Mantıklı ve kaliteli bir gezi planı (durak listesi) oluşturmak.

Çıktın KESİNLİKLE şu JSON şemasında olacak:

{
  ""totalDurationMinutes"": 300,
  ""summaryTr"": ""..."",
  ""summaryEn"": ""..."",
  ""stops"": [
    {
      ""order"": 1,
      ""time"": ""09:00"",
      ""placeId"": ""..."",
      ""placeNameTr"": ""..."",
      ""placeNameEn"": ""..."",
      ""durationTr"": ""1.5 saat"",
      ""durationEn"": ""1.5 hours"",
      ""descriptionTr"": ""..."",
      ""descriptionEn"": ""..."",
      ""notesTr"": ""..."",
      ""notesEn"": ""..."",
      ""category"": ""historical"",
      ""lat"": 0.0,
      ""lng"": 0.0
    }
  ]
}

Kurallar:

- Sadece sana verilen candidatePlaces listesindeki placeId’leri kullan.
- Yüksek puanlı ve popüler mekanları önceliklendir. Düşük puanlı yerleri sadece planı tamamlamak için gerekirse kullan.
- Ziyaret sırası mantıklı olsun; gereksiz ileri-geri gitme.
- time alanı 24 saat formatında olsun: ""09:00"", ""11:30"" gibi.
- totalDurationMinutes, durak sürelerinin toplamına yakın olsun.
- TR açıklamalarda samimi ama profesyonel, EN açıklamalarda akıcı bir turist rehberi tonu kullan.
- Cevapta JSON dışında hiçbir metin yazma.
";
    }

    private static string BuildUserPrompt(
        PlanRequestDto req,
        List<PlaceListItemDto> candidates)
    {
        var lang = req.Language == "EN" ? "EN" : "TR";

        var candidatesForPrompt = candidates.Select(p => new
        {
            p.PlaceId,
            p.NameTr,
            p.NameEn,
            p.Category,
            p.Rating,
            p.DistanceKm,
            p.ImageUrl,
            p.DurationTr,
            p.DurationEn
        });

        var obj = new
        {
            userPrefs = new
            {
                req.DurationHours,
                req.Intensity,
                req.Interests,
                req.Region,
                Language = lang
            },
            candidatePlaces = candidatesForPrompt
        };

        return JsonSerializer.Serialize(obj, JsonOpts);
    }
}
