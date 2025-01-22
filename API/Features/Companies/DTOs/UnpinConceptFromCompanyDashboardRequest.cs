namespace SECWatch.API.Features.Companies.DTOs;

public record UnpinConceptFromCompanyDashboardRequest
{
    public required string ConceptType { get; init; }
}