using RotaAI.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GooglePlacesService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

var app = builder.Build();

app.UseCors();

// Liste: İzmir müzeleri
app.MapGet("/api/museums", async (GooglePlacesService svc, double? lat, double? lng) =>
{
    var data = await svc.GetMuseumsAsync(lat, lng);
    return Results.Ok(data);
});

// Detay
app.MapGet("/api/places/{placeId}", async (GooglePlacesService svc, string placeId) =>
{
    var data = await svc.GetPlaceDetailAsync(placeId);
    return data is null ? Results.NotFound() : Results.Ok(data);
});

// Foto proxy
app.MapGet("/api/places/{placeId}/photo", async (GooglePlacesService svc, string placeId, int? maxWidth) =>
{
    var r = await svc.ProxyPhotoAsync(placeId, maxWidth);
    if (!r.IsSuccessStatusCode) return Results.NotFound();
    var stream = await r.Content.ReadAsStreamAsync();
    var contentType = r.Content.Headers.ContentType?.ToString() ?? "image/jpeg";
    return Results.Stream(stream, contentType);
});

app.Run();
