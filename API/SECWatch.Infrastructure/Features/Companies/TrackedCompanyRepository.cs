using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies;

public class TrackedCompanyRepository(ApplicationDbContext dbContext) : ITrackedCompanyRepository
{
    public async Task<IReadOnlyList<TrackedCompany>> GetTrackedCompaniesForUser(Guid userId)
    {
        var trackedCompanies = await dbContext.TrackedCompanies
            .Where(tc => tc.UserId == userId)
            .Include(tc => tc.Company)
            .ToListAsync();

        return trackedCompanies.AsReadOnly();
    }

    public async Task<TrackedCompany?> GetTrackedCompanyByCikForUser(string cik, Guid user)
    {
        var trackedCompany = await dbContext.TrackedCompanies
            .FirstOrDefaultAsync(tc => tc.UserId == user && tc.Company.Cik == cik);

        return trackedCompany;
    }

    public async Task<TrackedCompany?> AddAsync(TrackedCompany trackedCompany)
    {
        var result = await dbContext.TrackedCompanies.AddAsync(trackedCompany);
        await dbContext.SaveChangesAsync();

        return result.Entity;
    }

    public async Task<bool> RemoveAsync(Guid userId, Guid companyId)
    {
        var trackedCompany = await dbContext.TrackedCompanies
            .FirstOrDefaultAsync(tc => tc.UserId == userId && tc.CompanyId == companyId);

        if (trackedCompany == null)
        {
            return false;
        }

        dbContext.TrackedCompanies.Remove(trackedCompany);
        await dbContext.SaveChangesAsync();

        return true;
    }
}