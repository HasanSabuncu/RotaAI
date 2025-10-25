using System.Net.Http.Json;
using System.Text.Json;
using System.Web;
using RotaAI.Api.Models;

namespace RotaAI.Api.Services;

public sealed class GooglePlacesService(HttpClient http, IConfiguration cfg)
{
    private readonly string _key = cfg["GOOGLE_MAPS_API_KEY"]
        ?? throw new InvalidOperationException("GOOGLE_MAPS_API_KEY missing");

    // İzmir merkez (Konak)
    private const double CenterLat = 38.4192;
    private const double CenterLng = 27.1287;

    private static double DistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        double dLat = (lat2 - lat1) * Math.PI / 180.0;
        double dLon = (lon2 - lon1) * Math.PI / 180.0;
        double a = Math.Sin(dLat/2)*Math.Sin(dLat/2) +
                   Math.Cos(lat1*Math.PI/180.0) * Math.Cos(lat2*Math.PI/180.0) *
                   Math.Sin(dLon/2)*Math.Sin(dLon/2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1-a));
    }

    public async Task<IReadOnlyList<PlaceListItemDto>> GetMuseumsAsync(double? userLat = null, double? userLng = null)
    {
        var url = $"https://maps.googleapis.com/maps/api/place/textsearch/json" +
                  $"?query={HttpUtility.UrlEncode("museums in Izmir")}&language=tr&key={_key}";

        var root = await http.GetFromJsonAsync<JsonElement>(url);
        if (!root.TryGetProperty("results", out var arr) || arr.ValueKind != JsonValueKind.Array)
            return [];

        var list = new List<PlaceListItemDto>();

        foreach (var r in arr.EnumerateArray())
        {
            var placeId = r.GetProperty("place_id").GetString()!;
            var name = r.GetProperty("name").GetString()!;
            var rating = r.TryGetProperty("rating", out var rt) ? rt.GetDouble() : 0;

            var loc = r.GetProperty("geometry").GetProperty("location");
            var lat = loc.GetProperty("lat").GetDouble();
            var lng = loc.GetProperty("lng").GetDouble();

            // kategori basit eşleme
            var category = "historical";
            if (r.TryGetProperty("types", out var types))
            {
                var joined = string.Join(",", types.EnumerateArray().Select(x => x.GetString()));
                if (joined.Contains("art")) category = "art";
            }

            double dist = DistanceKm(userLat ?? CenterLat, userLng ?? CenterLng, lat, lng);

            list.Add(new PlaceListItemDto
            {
                PlaceId = placeId,
                NameTr = name,
                NameEn = name,
                Category = category,
                Rating = rating,
                DistanceKm = Math.Round(dist, 1),
                ImageUrl = $"/api/places/{placeId}/photo?maxWidth=800",
                DurationTr = "2 saat",
                DurationEn = "2 hours"
            });
        }

        return list;
    }

    public async Task<PlaceDetailDto?> GetPlaceDetailAsync(string placeId)
    {
        var url = $"https://maps.googleapis.com/maps/api/place/details/json" +
                  $"?place_id={HttpUtility.UrlEncode(placeId)}" +
                  $"&language=tr&fields=place_id,name,formatted_address,geometry,opening_hours,editorial_summary," +
                  $"rating,user_ratings_total,formatted_phone_number,website,address_components,photos" +
                  $"&key={_key}";

        var root = await http.GetFromJsonAsync<JsonElement>(url);
        if (!root.TryGetProperty("result", out var r)) return null;

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

        // foto referansı var mı
        var hasPhoto = r.TryGetProperty("photos", out var photos) &&
                       photos.ValueKind == JsonValueKind.Array &&
                       photos.GetArrayLength() > 0;

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
            EditorialSummary = r.TryGetProperty("editorial_summary", out var es) && es.TryGetProperty("overview", out var ov) ? ov.GetString() : null,
            PhotoUrl = hasPhoto ? $"/api/places/{placeId}/photo?maxWidth=800" : "",
            City = "İzmir",
            District = district,
            MainCategory = "Müzeler"
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
