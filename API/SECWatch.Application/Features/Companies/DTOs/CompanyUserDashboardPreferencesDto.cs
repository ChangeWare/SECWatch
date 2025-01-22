namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanyUserDashboardPreferencesDto
{
    public required List<string> PinnedConcepts { get; init; }
}