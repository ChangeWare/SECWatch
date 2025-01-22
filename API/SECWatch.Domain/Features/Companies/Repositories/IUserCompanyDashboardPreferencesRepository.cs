using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyUserDashboardPreferencesRepository
{
    Task<CompanyUserDashboardPreferences?> GetCompanyDashboardPreferencesForUser(Guid userId, string cik);
    
    Task<CompanyUserDashboardPreferences?> UpsertAsync(CompanyUserDashboardPreferences userCompanyDashboardPreferences);
    
    Task<bool> RemoveAsync(Guid userId, Guid companyId);
}