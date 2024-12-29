using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public class CompanyService(
    ICompanyRepository secCompanyRepository,
    IMapper mapper
    ) : ICompanyService
{
    public async Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        var result = await secCompanyRepository.SearchCompaniesAsync(req);
        
        if (result.IsFailed)
        {
            return result.ToResult<IEnumerable<CompanySearchResult>>();
        }
        
        var companiesSearchResponse = mapper.Map<IEnumerable<CompanySearchResult>>(result.Value);

        return Result.Ok(companiesSearchResponse);
    }

    public async Task<Result<CompanyDetails>> GetCompanyDetailsAsync(string cik)
    {
        // Ensure CIK is padded to 10 characters
        cik = cik.PadLeft(10, '0');
        
        var result = await secCompanyRepository.GetCompany(cik);
        
        if (result.IsFailed)
        {
            return result.ToResult<CompanyDetails>();
        }
        
        var companyDetails = mapper.Map<CompanyDetails>(result.Value);
        return Result.Ok(companyDetails);
    }
}