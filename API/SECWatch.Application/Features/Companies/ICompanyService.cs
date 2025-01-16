using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyService
{
    Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<CompanyDetails>> GetCompanyDetailsAsync(Guid userId, string ticker);
    
    
    Task<Result<CompanyFinancialMetricDto>> GetCompanyFinancialMetricAsync(string cik, FinancialMetricType metric);
    
    Task<Result<CompanyFilingHistoryDto>> GetCompanyFilingHistoryAsync(string cik);
}