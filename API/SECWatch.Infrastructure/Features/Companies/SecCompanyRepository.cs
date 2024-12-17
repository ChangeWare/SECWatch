using FluentResults;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Companies.DTOs;
using AutoMapper;

namespace SECWatch.Infrastructure.Features.Companies;

public class SecCompanyRepository(
    ISecCompanyRedisRepository companyRedisRepository,
    IMapper mapper) : ISecCompanyRepository
{
    public async Task<Result<IEnumerable<CompanySearchResponse>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        // We can use the Redis repository to search for companies.
        // We don't need more information than this for now for basic search functionality.
        
        var result =  await companyRedisRepository.SearchCompaniesAsync(req);
        
        if (result.IsFailed)
        {
            return Result.Fail<IEnumerable<CompanySearchResponse>>(result.Errors);
        }
        
        var searchResults  = result.Value.Select(mapper.Map<CompanySearchResponse>);
        return Result.Ok(searchResults);
    }

    public async Task<CompanyInfo?> GetCompany(string cik)
    {
        var company = await companyRedisRepository.GetCompany(cik);
        
        // TODO: return data from our database instead of the redis cache.
        
        return company;
    }
}