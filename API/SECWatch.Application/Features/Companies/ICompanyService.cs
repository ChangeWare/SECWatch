using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyService
{
    Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<CompanyDetails>> GetCompanyDetailsAsync(string ticker);
    
    Task<Result<CompanyFinancialMetricByPeriod>> GetCompanyFinancialMetricByPeriodAsync(string cik, FinancialMetricType metric, FinancialMetricPeriodType period);
}