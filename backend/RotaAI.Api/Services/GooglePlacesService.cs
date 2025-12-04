using System.Net.Http.Json;
using System.Text.Json;
using System.Web;
using System.Globalization;
using RotaAI.Api.Models;

namespace RotaAI.Api.Services;

public sealed class GooglePlacesService
{
    private readonly HttpClient http;
    private readonly string _key;

    public GooglePlacesService(HttpClient http, IConfiguration cfg)
    {
        this.http = http;
        _key = cfg["GOOGLE_MAPS_API_KEY"]
            ?? throw new InvalidOperationException("GOOGLE_MAPS_API_KEY missing");
    }

    // İzmir merkezi (fallback)
    private const double CenterLat = 38.4192;
    private const double CenterLng = 27.1287;

    private static double DistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        double dLat = (lat2 - lat1) * Math.PI / 180.0;
        double dLon = (lon2 - lon1) * Math.PI / 180.0;
        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }

    // Her arama için basit konfig
    private sealed record SearchConfig(string Query, string Category, int MaxPages = 2);

    /// <summary>
    /// Belirli bir Text Search query’si için 1–3 sayfa sonuç çeker (20’şer).
    /// Kullanıcı konumuna göre location+radius ile sınırlar.
    /// </summary>
    private async Task<List<JsonElement>> FetchTextSearchPagesAsync(
        string query,
        int maxPages,
        double baseLat,
        double baseLng)
    {
        var results = new List<JsonElement>();
        string? pageToken = null;

        var latStr = baseLat.ToString(CultureInfo.InvariantCulture);
        var lngStr = baseLng.ToString(CultureInfo.InvariantCulture);

        for (int page = 0; page < maxPages; page++)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/textsearch/json" +
                      $"?query={HttpUtility.UrlEncode(query)}" +
                      $"&location={latStr},{lngStr}" +
                      $"&radius=12000" + // 12 km yarıçap (istersen 8000 yapabilirsin)
                      $"&language=tr&region=tr&key={_key}" +
                      (pageToken != null ? $"&pagetoken={HttpUtility.UrlEncode(pageToken)}" : "");

            var root = await http.GetFromJsonAsync<JsonElement>(url);

            if (!root.TryGetProperty("results", out var arr) ||
                arr.ValueKind != JsonValueKind.Array)
                break;

            results.AddRange(arr.EnumerateArray());

            // Sonraki sayfa var mı?
            if (!root.TryGetProperty("next_page_token", out var tokenProp))
                break;

            pageToken = tokenProp.GetString();
            if (string.IsNullOrWhiteSpace(pageToken))
                break;

            // Google dokümanına göre yeni sayfa için kısa bir bekleme gerekli
            await Task.Delay(2000);
        }

        return results;
    }

    /// <summary>
    /// İzmir içindeki yerleri, kategori bazlı çoklu query ile çeker.
    /// family / romantic / gastronomy / shopping dahil.
    /// Kullanıcı Bornova civarındaysa Küçükpark, Homeros Vadisi vb. için ekstra Bornova query’leri ekler.
    /// </summary>
    public async Task<IReadOnlyList<PlaceListItemDto>> GetMuseumsAsync(double? userLat = null, double? userLng = null)
    {
        double baseLat = userLat ?? CenterLat;
        double baseLng = userLng ?? CenterLng;

        // --- ANA QUERY’LER ---
        var baseConfigs = new List<SearchConfig>
        {
            // TARİHİ
            new("müze izmir", "historical", 3),
            new("arkeoloji müzesi izmir", "historical", 2),
            new("tarihi yerler izmir", "historical", 2),

            // SANAT
            new("sanat galerisi izmir", "art", 3),
            new("sanat müzesi izmir", "art", 2),

            // DOĞA
            new("şehir parkı izmir", "nature", 3),
            new("yürüyüş parkuru izmir", "nature", 2),
            new("tabiat parkı izmir", "nature", 2),

            // AİLE
            new("çocuk müzesi izmir", "family", 2),
            new("çocuk parkı izmir", "family", 2),
            new("lunapark izmir", "family", 2),

            // ROMANTİK
            new("romantik restoran izmir", "romantic", 2),
            new("manzaralı cafe izmir", "romantic", 2),
            new("sahil yürüyüş yeri çiftler izmir", "romantic", 2),

            // GASTRONOMİ
            new("gastronomi restoran izmir", "gastronomy", 2),
            new("gurme restoran izmir", "gastronomy", 2),
            new("kahvaltı mekanı izmir", "gastronomy", 2),

            // RAHATLAMA / HAMAM / SPA
            new("spa hamam izmir", "relax", 2),
            new("hamam izmir", "relax", 2),
            new("spa wellness izmir", "relax", 2),

            // ALIŞVERİŞ
            new("alışveriş merkezi izmir", "shopping", 3),
            new("AVM izmir", "shopping", 2),
            new("outlet izmir", "shopping", 2)
        };

        // --- BORNOVA BOOST (Küçükpark, Homeros, Büyükpark, Forum Bornova) ---
        const double BornovaLat = 38.4622;
        const double BornovaLng = 27.2160;

        var distToBornova = DistanceKm(baseLat, baseLng, BornovaLat, BornovaLng);

        if (distToBornova < 6.0) // 6 km içinde isen Bornova say
        {
            baseConfigs.AddRange(new[]
            {
                // Küçükpark ve civarı kafeler
                new SearchConfig("küçükpark bornova cafe", "gastronomy", 2),
                new SearchConfig("bornova küçükpark bar cafe", "gastronomy", 1),

                // Homeros Vadisi
                new SearchConfig("homeros vadisi izmir doğa yürüyüş", "nature", 2),

                // Bornova Büyükpark
                new SearchConfig("bornova büyükpark", "nature", 1),

                // Forum Bornova (zaten gelir ama güçlendirelim)
                new SearchConfig("forum bornova alışveriş merkezi", "shopping", 1)
            });
        }

        var configs = baseConfigs.ToArray();

        // Tüm query’leri paralel çalıştır → hızlanma
        var tasks = configs.Select(async cfg =>
        {
            var items = await FetchTextSearchPagesAsync(cfg.Query, cfg.MaxPages, baseLat, baseLng);
            return (cfg.Category, Items: items);
        }).ToArray();

        var rawResults = await Task.WhenAll(tasks);

        // placeId bazlı duplicate temizleme
        var dict = new Dictionary<string, PlaceListItemDto>();

        foreach (var group in rawResults)
        {
            string category = group.Category;

            foreach (var r in group.Items)
            {
                if (!r.TryGetProperty("place_id", out var pidProp))
                    continue;

                var placeId = pidProp.GetString();
                if (string.IsNullOrEmpty(placeId) || dict.ContainsKey(placeId))
                    continue;

                try
                {
                    var name = r.GetProperty("name").GetString() ?? "";
                    double rating = r.TryGetProperty("rating", out var rt) &&
                rt.ValueKind == JsonValueKind.Number
    ? rt.GetDouble()
    : 0;

                    // user_ratings_total (yoksa 0)
                    int userRatingsTotal = r.TryGetProperty("user_ratings_total", out var ur) &&
                                           ur.ValueKind == JsonValueKind.Number
                        ? ur.GetInt32()
                        : 0;

                    if (!r.TryGetProperty("geometry", out var geom) ||
                        !geom.TryGetProperty("location", out var loc))
                        continue;

                    double lat = loc.GetProperty("lat").GetDouble();
                    double lng = loc.GetProperty("lng").GetDouble();

                    double dist = DistanceKm(baseLat, baseLng, lat, lng);

                    // Foto – detay endpoint’ine proxy üzerinden gidiyoruz
                    string imageUrl = $"/api/places/{placeId}/photo?maxWidth=800";

                    dict[placeId] = new PlaceListItemDto
                    {
                        PlaceId = placeId,
                        NameTr = name,
                        NameEn = name,
                        Category = category,
                        Rating = rating,
                        UserRatingsTotal = userRatingsTotal,
                        DistanceKm = Math.Round(dist, 1),
                        Lat = lat,
                        Lng = lng,
                        ImageUrl = imageUrl,
                        DurationTr = "2 saat",
                        DurationEn = "2 hours"
                    };

                }
                catch
                {
                    // Tek bir place bozuksa tüm listeyi bozmamak için ignore
                }
            }
        }

        var list = dict.Values
                       .OrderBy(p => p.DistanceKm)
                       .ThenByDescending(p => p.Rating)
                       .ToList();

        return list;
    }

    // ==================== DETAY & FOTO ====================

    public async Task<PlaceDetailDto?> GetPlaceDetailAsync(string placeId)
    {
        // TR detay + reviews
        var urlTr = $"https://maps.googleapis.com/maps/api/place/details/json" +
                    $"?place_id={HttpUtility.UrlEncode(placeId)}" +
                    $"&language=tr" +
                    $"&fields=place_id,name,formatted_address,geometry,opening_hours,editorial_summary," +
                    $"rating,user_ratings_total,formatted_phone_number,website,address_components,photos,reviews" +
                    $"&key={_key}";

        var rootTr = await http.GetFromJsonAsync<JsonElement>(urlTr);
        if (!rootTr.TryGetProperty("result", out var r)) return null;

        // EN “About” için ikinci istek (yalnızca editorial_summary)
        string? descEn = null;
        try
        {
            var urlEn = $"https://maps.googleapis.com/maps/api/place/details/json" +
                        $"?place_id={HttpUtility.UrlEncode(placeId)}&language=en&fields=editorial_summary&key={_key}";
            var rootEn = await http.GetFromJsonAsync<JsonElement>(urlEn);
            if (rootEn.TryGetProperty("result", out var ren) &&
                ren.TryGetProperty("editorial_summary", out var esEn) &&
                esEn.TryGetProperty("overview", out var ovEn))
            {
                descEn = ovEn.GetString();
            }
        }
        catch
        {
            // EN yoksa sorun değil
        }

        string district = "";
        if (r.TryGetProperty("address_components", out var comps))
        {
            foreach (var c in comps.EnumerateArray())
            {
                var types = c.GetProperty("types").EnumerateArray().Select(x => x!.GetString()).ToArray();
                if (types.Contains("administrative_area_level_2") || types.Contains("sublocality"))
                    district = c.GetProperty("long_name").GetString() ?? "";
            }
        }

        var loc = r.GetProperty("geometry").GetProperty("location");

        var hasPhoto = r.TryGetProperty("photos", out var photos) &&
                       photos.ValueKind == JsonValueKind.Array &&
                       photos.GetArrayLength() > 0;

        // İlk 3 review (varsa)
        List<PlaceReviewDto>? reviews = null;
        if (r.TryGetProperty("reviews", out var revs) &&
            revs.ValueKind == JsonValueKind.Array && revs.GetArrayLength() > 0)
        {
            reviews = revs.EnumerateArray()
                          .Take(3)
                          .Select(rev => new PlaceReviewDto
                          {
                              AuthorName = rev.TryGetProperty("author_name", out var an) ? an.GetString() : null,
                              Rating = rev.TryGetProperty("rating", out var rr) ? rr.GetDouble() : 0,
                              RelativeTime = rev.TryGetProperty("relative_time_description", out var rt) ? rt.GetString() : null,
                              Text = rev.TryGetProperty("text", out var tx) ? tx.GetString() : null,
                              ProfilePhotoUrl = rev.TryGetProperty("profile_photo_url", out var pp) ? pp.GetString() : null
                          })
                          .ToList();
        }

        return new PlaceDetailDto
        {
            PlaceId = r.GetProperty("place_id").GetString()!,
            Name = r.GetProperty("name").GetString()!,
            Rating = r.TryGetProperty("rating", out var rt) ? rt.GetDouble() : 0,
            UserRatingsTotal = r.TryGetProperty("user_ratings_total", out var ur) ? ur.GetInt32() : 0,
            FormattedAddress = r.TryGetProperty("formatted_address", out var fa) ? fa.GetString() ?? "" : "",
            Lat = loc.GetProperty("lat").GetDouble(),
            Lng = loc.GetProperty("lng").GetDouble(),
            OpeningNow = r.TryGetProperty("opening_hours", out var oh) && oh.TryGetProperty("open_now", out var on) ? on.GetBoolean() : null,
            WeekdayText = r.TryGetProperty("opening_hours", out var oh2) && oh2.TryGetProperty("weekday_text", out var wdt)
                ? wdt.EnumerateArray().Select(x => x.GetString() ?? "").ToList()
                : null,
            Phone = r.TryGetProperty("formatted_phone_number", out var ph) ? ph.GetString() : null,
            Website = r.TryGetProperty("website", out var ws) ? ws.GetString() : null,

            // Hakkında
            DescriptionTr = r.TryGetProperty("editorial_summary", out var esTr) && esTr.TryGetProperty("overview", out var ovTr) ? ovTr.GetString() : null,
            DescriptionEn = descEn,

            PhotoUrl = hasPhoto ? $"/api/places/{placeId}/photo?maxWidth=800" : "",
            City = "İzmir",
            District = district,
            MainCategory = "Müzeler",

            // İlk 3 yorum
            Reviews = reviews
        };
    }

    public async Task<HttpResponseMessage> ProxyPhotoAsync(string placeId, int? maxWidth)
    {
        var detailsUrl = $"https://maps.googleapis.com/maps/api/place/details/json" +
                         $"?place_id={HttpUtility.UrlEncode(placeId)}&fields=photos&key={_key}";
        var root = await http.GetFromJsonAsync<JsonElement>(detailsUrl);
        if (!root.TryGetProperty("result", out var r) ||
            !r.TryGetProperty("photos", out var photos) ||
            photos.GetArrayLength() == 0)
            return new HttpResponseMessage(System.Net.HttpStatusCode.NotFound);

        var photoRef = photos[0].GetProperty("photo_reference").GetString()!;
        var url = $"https://maps.googleapis.com/maps/api/place/photo?photo_reference={HttpUtility.UrlEncode(photoRef)}" +
                  $"{(maxWidth.HasValue ? $"&maxwidth={maxWidth}" : "")}&key={_key}";

        return await http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
    }
}
