using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Companies;

public class CompanyService(
    ICompanyRepository companyRepository,
    ICompanyConceptRepository companyFinancialMetricsRepository,
    ITrackedCompanyRepository trackedCompanyRepository,
    IMapper mapper,
    IConceptCategoriesService categoriesService
    ) : ICompanyService
{
    public async Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        var companies = await companyRepository.SearchCompaniesAsync(req.Query);
        
        var companiesSearchResponse = mapper.Map<IEnumerable<CompanySearchResult>>(companies);

        return Result.Ok(companiesSearchResponse);
    }

    public async Task<Result<CompanyDetails>> GetCompanyDetailsAsync(Guid userId, string cik)
    {
        // Ensure CIK is padded to 10 characters
        cik = cik.PadLeft(10, '0');
        
        var company = await companyRepository.GetCompanyAsync(cik);
        
        
        var companyDetails = mapper.Map<CompanyDetails>(company);
        
        // Check whether the user is tracking this company
        var trackedCompany = await trackedCompanyRepository.GetTrackedCompanyByCikForUser(cik, userId);
        companyDetails.IsTracked = trackedCompany != null;
        
        return Result.Ok(companyDetails);
    }

    public async Task<Result<IReadOnlyList<string>>> GetCompanyConceptTypesAsync(string cik)
    {
        var conceptTypes = await companyFinancialMetricsRepository.GetCompanyConceptTypesAsync(cik);
        
        return Result.Ok(conceptTypes);
    }

    public async Task<Result<CompanyConceptDto>> GetCompanyConceptAsync(string cik, string conceptType)
    {
        var concept = await companyFinancialMetricsRepository.GetCompanyConceptAsync(cik, conceptType);
        
        var metroDto = mapper.Map<CompanyConceptDto>(concept);
        
        return Result.Ok(metroDto);
    }

    public async Task<Result<IReadOnlyList<CompanyConceptDto>>> GetCompanyConceptsAsync(string cik)
    {
        var concepts = await companyFinancialMetricsRepository.GetCompanyConceptsAsync(cik);
        
        var conceptsDto = mapper.Map<IReadOnlyList<CompanyConceptDto>>(concepts);
        
        conceptsDto = conceptsDto.Select(dto =>
        {
            var categoryInfo = categoriesService.GetCategory(dto.ConceptType);
            return dto with 
            { 
                Category = categoryInfo?.Category ?? "Misc",
                Description = categoryInfo?.Description ?? "",
                IsCurrencyData = categoryInfo?.IsCurrencyData ?? true
            };
        }).ToList();
        
        return Result.Ok(conceptsDto);
    }

    public async Task<Result<CompanyFilingHistoryDto>> GetCompanyFilingHistoryAsync(string cik)
    {
        var filingHistory = await companyRepository.GetCompanyFilingsHistoryAsync(cik);
        
        var filingHistoryDto = mapper.Map<CompanyFilingHistoryDto>(filingHistory);
        
        return Result.Ok(filingHistoryDto);
    }
}