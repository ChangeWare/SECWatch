using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanySearchResponse
{
    public required IEnumerable<CompanySearchResult> Companies { get; init; }
}