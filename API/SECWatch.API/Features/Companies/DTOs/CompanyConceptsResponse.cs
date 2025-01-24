using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyConceptsResponse
{
    public required IReadOnlyList<CompanyConceptDto> Concepts { get; init; }
}