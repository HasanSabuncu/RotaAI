// backend/RotaAI.Api/Program.cs
using RotaAI.Api.Models;
using RotaAI.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Google Places servisi
builder.Services.AddHttpClient<GooglePlacesService>();

// OpenAI için HttpClientFactory
builder.Services.AddHttpClient("openai", client =>
{
    client.Timeout = TimeSpan.FromSeconds(60);
});

// Plan servisi
builder.Services.AddScoped<PlanAiService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

var app = builder.Build();

app.UseCors();

// ==================== PLACES / MUSEUMS ====================

// Liste: İzmir müzeleri / mekanları
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

// ==================== PLAN (GPT BEYNİ) ====================

app.MapPost("/api/plan", async (
    PlanAiService planSvc,
    PlanRequestDto request) =>
{
    try
    {
        var plan = await planSvc.GeneratePlanAsync(request);
        return Results.Ok(plan);
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Plan oluşturulamadı",
            detail: ex.Message,
            statusCode: 500);
    }
});

app.Run();
