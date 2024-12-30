using FluentResults;
using SECWatch.Domain.Features.Companies.Queries;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyRepository
{
    Task<Result<IEnumerable<Company>>> SearchCompaniesAsync(CompanySearchQuery query);
    
    Task<Result<Company?>> GetCompanyAsync(string cik);
}