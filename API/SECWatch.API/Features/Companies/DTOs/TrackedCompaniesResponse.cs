using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record TrackedCompaniesResponse
{
    public required IReadOnlyList<TrackedCompanyDetails> TrackedCompanies { get; set; }
}