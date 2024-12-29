using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record AccountsPayableResponse
{
    public required string CIK { get; set; }
    public required string CompanyName { get; set; }
    public required MetricMetadata Metadata { get; set; }
    public required List<AccountsPayableDataPoint> DataPoints { get; set; }
    public required AccountsPayableSummary Summary { get; set; }
}