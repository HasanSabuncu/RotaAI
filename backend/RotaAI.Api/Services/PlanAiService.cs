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

    // =========================================================
    //  ANA GİRİŞ NOKTASI
    // =========================================================
    public async Task<PlanResponseDto> GeneratePlanAsync(PlanRequestDto request)
    {
        // 1) Kullanıcı konumuna göre çevredeki tüm mekanları çek
        var places = await _placesService.GetMuseumsAsync(
            request.StartLat,
            request.StartLng
        );

        // 2) Candidate listeyi akıllı scoring ile süz
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
            model = "gpt-4.1-mini",  // istersen gpt-4.1 yaparsın
            messages = new[]
            {
                new { role = "system", content = sysPrompt },
                new { role = "user",   content = userPrompt }
            },
            response_format = new { type = "json_object" }   // JSON zorunlu
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

        // Basit güvenlik / temizlik
        plan.Stops = plan.Stops
            .OrderBy(s => s.Order)
            .Take(20)
            .ToList();

        return plan;
    }

    // =========================================================
    //  AKILLI FİLTRE / SCORING
    // =========================================================
    private static List<PlaceListItemDto> FilterCandidates(
        IReadOnlyList<PlaceListItemDto> places,
        PlanRequestDto req)
    {
        if (places.Count == 0)
            return new List<PlaceListItemDto>();

        var interestSet = req.Interests
            .Select(i => i.ToLowerInvariant())
            .ToHashSet();

        // interest -> category mapping (backend kategorileri)
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
        var region = string.IsNullOrWhiteSpace(req.Region) ? "nearby" : req.Region;

        double maxDistKm;
        if (region == "nearby")
        {
            // Konumuma yakın modu – aynı ilçe içinde rahatça gidilebilecek mesafe
            maxDistKm = req.Intensity switch
            {
                // Rahat tempo: yakın ama illa dip dibe değil
                "relaxed" => 8.0,

                // Yoğun tempo: biraz daha açılabilir
                "intensive" => 12.0,

                // Orta tempo: yaklaşık 3–10 km bandı
                _ => 10.0
            };
        }
        else
        {
            // İzmir geneli
            maxDistKm = req.Intensity switch
            {
                "relaxed" => 12,
                "intensive" => 40,
                _ => 25
            };
        }

        // Önce sadece mesafeye göre kaba filtre
        var baseByDistance = places
            .Where(p => p.DistanceKm <= maxDistKm)
            .ToList();

        if (baseByDistance.Count == 0)
            baseByDistance = places.ToList(); // çok kıt bölgede fallback

        // Rating barajını dinamik ayarla: önce yüksek dene, yetmezse düşür
        double[] ratingThresholds = { 4.3, 4.1, 3.9, 3.7 };
        List<PlaceListItemDto> baseQuery = new();

        foreach (var th in ratingThresholds)
        {
            baseQuery = baseByDistance
                .Where(p => p.Rating >= th)
                .ToList();

            if (baseQuery.Count >= 6) break; // yeterince aday varsa dur
        }

        if (baseQuery.Count == 0)
            baseQuery = baseByDistance; // hâlâ boşsa sadece mesafeye göre devam

        // İlgi alanı kategorisi uygula (varsa)
        if (targetCats.Count > 0)
        {
            var byCat = baseQuery
                .Where(p => targetCats.Contains(p.Category))
                .ToList();

            // hiç kalmazsa kategoriyi esnet → kullanıcı boşa 500 hatası almasın
            if (byCat.Count > 0)
                baseQuery = byCat;
        }

        // Güçlü aday: yüksek puan + anlamlı yorum sayısı
        bool HasDecentReviews(PlaceListItemDto p) => p.UserRatingsTotal >= 20;

        var strong = baseQuery
            .Where(p => p.Rating >= 4.2 && HasDecentReviews(p))
            .ToList();

        // Yetmezse biraz gevşet
        if (strong.Count < maxStops * 2)
        {
            var medium = baseQuery
                .Where(p => p.Rating >= 4.0 && p.UserRatingsTotal >= 8)
                .Where(p => strong.All(s => s.PlaceId != p.PlaceId))
                .ToList();

            strong.AddRange(medium);
        }

        var candidates = strong;
        if (candidates.Count < maxStops)
        {
            // Yine de rota dolsun diye kalanları da ekle
            var rest = baseQuery
                .Where(p => candidates.All(c => c.PlaceId != p.PlaceId))
                .ToList();
            candidates.AddRange(rest);
        }

        if (candidates.Count == 0)
            candidates = places.ToList();

        // Skor fonksiyonu: rating + review boost - mesafe cezası
        double Score(PlaceListItemDto p)
        {
            // Review sayısını logaritmik sıkıştır
            var reviews = Math.Max(p.UserRatingsTotal, 0);
            double reviewScore = Math.Log10(reviews + 1); // 0–3 arası
            reviewScore = Math.Min(reviewScore / 3.0, 1.0); // 0–1 arası normalize

            double distancePenalty = region == "nearby"
                ? p.DistanceKm * 0.15   // yakında rota istiyorsa mesafe önemli
                : p.DistanceKm * 0.06;

            return (p.Rating * 0.7) + (reviewScore * 0.3) - distancePenalty;
        }

        // En iyi adayları seç
        var ranked = candidates
            .OrderByDescending(Score)
            .Take(maxStops * 4) // GPT’ye geniş ama kaliteli bir havuz ver
            .ToList();

        return ranked;
    }

    // =========================================================
    //  PROMPTLAR
    // =========================================================
    private static string BuildSystemPrompt()
    {
        return @"
Sen bir rota planlama yapay zekasısın.
Kendini İzmir’i ve çevresini çok iyi bilen, gezi önerileriyle tanınan
deneyimli bir yerel rehber gibi düşün.

Görevin:
- Kullanıcının süre, yoğunluk, ilgi alanları ve rota bölgesine göre
- Sana verilen candidatePlaces listesinden
- Gerçek hayatta mantıklı, kaliteli ve gidilmeye değer bir gezi planı (durak listesi) oluşturmak.

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

KURALLAR (ÇOK ÖNEMLİ):

1) SADECE JSON DÖN
- Açıklama, cümle, markdown vb. yazma.
- Sadece yukarıdaki şemaya uyan bir JSON obje döndür.

2) KALİTE KRİTERLERİ
- candidatePlaces içindeki rating ve userRatingsTotal alanlarını kullan.
- Çok az yorumlu (ör: 1–2 yorum) ama 5.0 puanlı mekanları zayıf aday olarak düşün.
- Tercihen hem puanı yüksek hem de yorum sayısı fazla olan yerleri seç.
- Aynı kategoriye ait sıradan yerlerden çok, bölgeyi temsil eden güçlü, karakteri olan mekanlar seçmeye çalış.

3) ÇEŞİTLİLİK
- Plan sadece kafelerden veya sadece sanat galerilerinden oluşmasın.
- Kullanıcının ilgi alanlarına göre:
  - Eğer history seçiliyse, mümkünse en az 1 tarihi / kültürel durak ekle.
  - Eğer nature seçiliyse, mümkünse en az 1 park / yeşil alan / doğa noktası ekle.
  - Eğer gastronomy seçiliyse, en az 1 tane güçlü kafe / yemek durağı ekle.
- Toplam 3–7 durak arası plan üret (süre ve yoğunluğa göre).
  - 4–5 saat civarı → 3–4 durak
  - 6–8 saat civarı → 4–6 durak
  - Daha uzun ise → 5–7 durak

4) MESAFE ve ROTA MANTIĞI
- candidatePlaces.distanceKm alanını kullan.
- region = ""nearby"" ise:
  - Önceliğin birbirine yakın, yürünebilir duraklar olsun.
  - Mümkünse 0–2 km arası yerlere ağırlık ver, 4–5 km üstüne sadece gerekirse çık.
- region = ""city"" ise:
  - İzmir içinde anlamlı geçişler yap; çok saçma zigzaglı rota oluşturma.
- Ziyaret sırası mantıklı olsun; kullanıcıyı ileri–geri dolaştırma.

5) ZAMANLAMA
- İlk durak için mantıklı bir başlangıç saati seç (09:00, 10:00 gibi).
- Her durak için durationTr / durationEn alanlarında gerçekçi süreler kullan (1–2 saat gibi).
- totalDurationMinutes, tüm durakların toplamına yakın olsun ve userPrefs.DurationHours ile uyumlu olsun.

6) METİN STİLİ
- summaryTr: Rotayı bir arkadaşına anlatır gibi, samimi ama profesyonel bir tonda özetle.
- summaryEn: Akıcı bir turist rehberi gibi yaz.
- descriptionTr / descriptionEn:
  - O durak neden güzel, orada ne yapılır, nasıl bir atmosfer var, kısaca anlat.
  - Puan veya yorum sayısından bahsetme; kullanıcıya “ne hissedeceğini / ne yapacağını” anlat.

Yukarıdaki kurallara kesinlikle uy ve SADECE JSON objesi döndür.
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
            p.UserRatingsTotal,
            p.DistanceKm,
            p.ImageUrl,
            p.DurationTr,
            p.DurationEn,
            p.Lat,
            p.Lng
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
