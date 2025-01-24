using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyFilingHistoryResponse
{
    public required CompanyFilingHistoryDto FilingHistory { get; init; }
}