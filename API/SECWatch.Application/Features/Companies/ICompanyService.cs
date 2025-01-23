using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyService
{
    Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<CompanyDetails>> GetCompanyDetailsAsync(Guid userId, string ticker);
    
    Task<Result<IReadOnlyList<string>>> GetCompanyConceptTypesAsync(string cik);
    
    Task<Result<CompanyConceptDto>> GetCompanyConceptAsync(string cik, string conceptType);
    
    Task<Result<IReadOnlyList<CompanyConceptDto>>> GetCompanyConceptsAsync(string cik, List<string> conceptTypes);
    
    Task<Result<IReadOnlyList<CompanyConceptDto>>> GetCompanyAllConceptsAsync(string cik);
    
    Task<Result<CompanyFilingHistoryDto>> GetCompanyFilingHistoryAsync(string cik);
}