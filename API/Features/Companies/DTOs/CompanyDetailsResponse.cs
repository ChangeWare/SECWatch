using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyDetailsResponse
{
    public CompanyDetails? Company { get; init; }
}