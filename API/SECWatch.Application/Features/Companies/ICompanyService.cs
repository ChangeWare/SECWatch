using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyService
{
    Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<CompanyDetails>> GetCompanyDetailsAsync(string ticker);
}