using FluentResults;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Queries;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyRepository
{
    Task<Result<IEnumerable<Company>>> SearchCompaniesAsync(CompanySearchQuery query);
    
    Task<Result<Company?>> GetCompanyAsync(string cik);
}