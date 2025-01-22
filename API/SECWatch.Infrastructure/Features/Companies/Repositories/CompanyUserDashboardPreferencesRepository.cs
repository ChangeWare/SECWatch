using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies.Repositories;

public class CompanyUserDashboardPreferencesRepository(ApplicationDbContext dbContext) 
    : ICompanyUserDashboardPreferencesRepository
{
    public async Task<CompanyUserDashboardPreferences?> GetCompanyDashboardPreferencesForUser(Guid userId, string cik)
    {
        var result = await dbContext.CompanyUserDashboardPreferences
            .Where(x => x.UserId == userId && x.Company.Cik == cik)
            .FirstOrDefaultAsync();

        return result;
    }

    public async Task<CompanyUserDashboardPreferences?> UpsertAsync(CompanyUserDashboardPreferences userCompanyDashboardPreferences)
    {
        var existing = await dbContext.CompanyUserDashboardPreferences
            .Where(x => x.UserId == userCompanyDashboardPreferences.UserId && x.CompanyId == userCompanyDashboardPreferences.CompanyId)
            .FirstOrDefaultAsync();

        if (existing is not null)
        {
            dbContext.CompanyUserDashboardPreferences.Update(userCompanyDashboardPreferences);
        }
        else
        {
            await dbContext.CompanyUserDashboardPreferences.AddAsync(userCompanyDashboardPreferences);
        }

        await dbContext.SaveChangesAsync();

        return userCompanyDashboardPreferences;
    }

    public async Task<bool> RemoveAsync(Guid userId, Guid companyId)
    {
        var existing = await dbContext.CompanyUserDashboardPreferences
            .Where(x => x.UserId == userId && x.CompanyId == companyId)
            .FirstOrDefaultAsync();

        if (existing is null)
        {
            return false;
        }

        dbContext.CompanyUserDashboardPreferences.Remove(existing);
        await dbContext.SaveChangesAsync();

        return true;
    }
}