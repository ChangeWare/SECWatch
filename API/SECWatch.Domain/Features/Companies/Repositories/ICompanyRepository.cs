using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Queries;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyRepository
{
    Task<IReadOnlyList<Company>> SearchCompaniesAsync(CompanySearchQuery query);
    
    Task<Company?> GetCompanyAsync(string cik);
    
    Task<CompanyFilingHistory> GetCompanyFilingsHistoryAsync(string cik);

    Task<CompanyFiling?> GetCompanyMostRecentFilingAsync(string cik);

    Task<Dictionary<string, CompanyFiling?>> GetCompaniesMostRecentFilingsAsync(IEnumerable<string> ciks);
}