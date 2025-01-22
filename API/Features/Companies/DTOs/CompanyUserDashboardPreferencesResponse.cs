using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyUserDashboardPreferencesResponse
{
    public required CompanyUserDashboardPreferencesDto Preferences { get; init; }
}