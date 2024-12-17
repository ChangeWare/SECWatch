using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyResults
{
    public required IEnumerable<CompanySearchResponse> Companies { get; init; }
}