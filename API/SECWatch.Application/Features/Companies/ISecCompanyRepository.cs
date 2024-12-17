using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ISecCompanyRepository
{
    Task<Result<IEnumerable<CompanySearchResponse>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<CompanyInfo?> GetCompany(string cik);
}