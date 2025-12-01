namespace RotaAI.Api.Models;

public sealed class PlaceListItemDto
{
    public string PlaceId { get; set; } = default!;
    public string NameTr { get; set; } = default!;
    public string NameEn { get; set; } = default!;
    public string Category { get; set; } = "historical";
    public double Rating { get; set; }
    public double DistanceKm { get; set; }
    public string ImageUrl { get; set; } = default!;
    public string DurationTr { get; set; } = "2 saat";
    public string DurationEn { get; set; } = "2 hours";
}

public sealed class PlaceReviewDto
{
    public string? AuthorName { get; set; }
    public double Rating { get; set; }
    public string? RelativeTime { get; set; }
    public string? Text { get; set; }
    public string? ProfilePhotoUrl { get; set; }
}

public sealed class PlaceDetailDto
{
    public string PlaceId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public double Rating { get; set; }
    public int UserRatingsTotal { get; set; }
    public string FormattedAddress { get; set; } = default!;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public bool? OpeningNow { get; set; }
    public List<string>? WeekdayText { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }

    // HAKKINDA
    public string? DescriptionTr { get; set; }     // editorial_summary (TR)
    public string? DescriptionEn { get; set; }     // editorial_summary (EN)

    public string PhotoUrl { get; set; } = default!;
    public string City { get; set; } = "İzmir";
    public string District { get; set; } = "";
    public string MainCategory { get; set; } = "Müzeler";

    // İlk 3 yorum
    public List<PlaceReviewDto>? Reviews { get; set; }
}
