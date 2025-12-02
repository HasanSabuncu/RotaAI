// backend/RotaAI.Api/Models/PlanDtos.cs
namespace RotaAI.Api.Models;

public sealed class PlanRequestDto
{
    public double? StartLat { get; set; }
    public double? StartLng { get; set; }

    // Planner sayfasındaki süre slider’ı
    public int DurationHours { get; set; } = 8;

    // ['history', 'nature', 'gastronomy', ...]
    public List<string> Interests { get; set; } = new();

    // 'relaxed' | 'moderate' | 'intensive'
    public string Intensity { get; set; } = "moderate";

    // 'TR' | 'EN'
    public string Language { get; set; } = "TR";

    // Tarih, şimdilik sadece gösterim için
    public DateTime? Date { get; set; }

    // Rota bölgesi:
    // 'nearby' = konuma yakın, yürünebilir rota
    // 'city'   = İzmir geneli rota
    public string Region { get; set; } = "nearby";
}

public sealed class PlanStopDto
{
    public int Order { get; set; }              // 1,2,3...
    public string Time { get; set; } = "";      // "09:00"

    public string PlaceId { get; set; } = "";
    public string PlaceNameTr { get; set; } = "";
    public string PlaceNameEn { get; set; } = "";

    public string DurationTr { get; set; } = ""; // "1.5 saat"
    public string DurationEn { get; set; } = ""; // "1.5 hours"

    public string DescriptionTr { get; set; } = "";
    public string DescriptionEn { get; set; } = "";

    public string? NotesTr { get; set; }
    public string? NotesEn { get; set; }

    public string Category { get; set; } = ""; // historical / nature / ...
    public double? Lat { get; set; }
    public double? Lng { get; set; }
}

public sealed class PlanResponseDto
{
    public int TotalDurationMinutes { get; set; }
    public string SummaryTr { get; set; } = "";
    public string SummaryEn { get; set; } = "";
    public List<PlanStopDto> Stops { get; set; } = new();
}
