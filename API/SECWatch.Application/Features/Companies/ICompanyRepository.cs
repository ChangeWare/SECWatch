using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyRepository
{
    Task<Result<IEnumerable<Company>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<Result<Company?>> GetCompany(string cik);
}