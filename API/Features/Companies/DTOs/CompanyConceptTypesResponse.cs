namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyConceptTypesResponse
{
    public required IReadOnlyList<string> ConceptTypes { get; set; }
}