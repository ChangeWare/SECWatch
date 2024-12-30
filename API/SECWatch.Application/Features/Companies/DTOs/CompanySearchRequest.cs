using SECWatch.Domain.Features.Companies.Queries;

namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanySearchRequest
{
    public CompanySearchQuery Query { get; init; }
}

