using System.IO.Compression;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Application.Features.Companies;


public class SecApiService(ISecCompanyRepository secCompanyRepository) : ISecApiService
{
    public async Task<Result<IEnumerable<CompanySearchResponse>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        var result = await secCompanyRepository.SearchCompaniesAsync(req);

        return result;
    }
}