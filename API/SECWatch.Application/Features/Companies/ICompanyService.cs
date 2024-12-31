using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyService
{
    Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<CompanyDetails>> GetCompanyDetailsAsync(string ticker);
    
    Task<Result<CompanyFinancialMetricDto>> GetCompanyFinancialMetricAsync(string cik, FinancialMetricType metric);
}