using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyUserDashboardPreferencesService
{
    Task<Result<CompanyUserDashboardPreferencesDto>> AddConceptToDashboard(string cik, Guid userId, string conceptType);

    Task<Result<CompanyUserDashboardPreferencesDto>> GetCompanyDashboardPreferencesForUser(string cik, Guid userId);
}