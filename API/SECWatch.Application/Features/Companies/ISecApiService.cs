using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ISecApiService
{
    Task<Result<IEnumerable<CompanySearchResponse>>> SearchCompaniesAsync(CompanySearchRequest req);
}