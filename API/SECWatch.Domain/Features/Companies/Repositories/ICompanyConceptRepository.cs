using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyConceptRepository
{
    Task<IReadOnlyList<CompanyConcept>> GetCompanyConceptsAsync(string cik);
    
    Task<IReadOnlyList<string>> GetCompanyConceptTypesAsync(string cik);
    
    Task<CompanyConcept> GetCompanyConceptAsync(string cik, string conceptType);
}