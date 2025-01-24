namespace SECWatch.API.Features.Companies.DTOs;

public record PinConceptToCompanyDashboardRequest
{
    public required string ConceptType { get; set; } 
}