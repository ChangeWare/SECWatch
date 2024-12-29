namespace SECWatch.Application.Features.Companies.DTOs;

public record MetricMetadata
{
    public required string Label { get; init; }
    public required string Description { get; init; }
    public required string Unit { get; init; }
    public required string Category { get; init; }
    public required string Subcategory { get; init; }
}