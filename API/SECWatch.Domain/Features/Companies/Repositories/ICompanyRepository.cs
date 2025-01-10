using FluentResults;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Queries;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyRepository
{
    Task<Result<IReadOnlyList<Company>>> SearchCompaniesAsync(CompanySearchQuery query);
    
    Task<Result<Company?>> GetCompanyAsync(string cik);
    
    Task<Result<CompanyFilingHistory>> GetCompanyFilingsHistoryAsync(string cik);
}