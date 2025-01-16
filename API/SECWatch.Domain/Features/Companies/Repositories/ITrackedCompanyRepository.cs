using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ITrackedCompanyRepository
{
    Task<IReadOnlyList<TrackedCompany>> GetTrackedCompaniesForUser(Guid userId);
    
    Task<TrackedCompany?> GetTrackedCompanyByCikForUser(string cik, Guid user);
    
    Task<TrackedCompany?> AddAsync(TrackedCompany trackedCompany);
    
    Task<bool> RemoveAsync(Guid userId, Guid companyId);
}