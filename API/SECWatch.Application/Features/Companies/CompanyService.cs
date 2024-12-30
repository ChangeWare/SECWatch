using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Application.Features.Companies.DTOs.Configurations;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Companies;

public class CompanyService(
    ICompanyRepository companyRepository,
    ICompanyFinancialMetricsRepository companyFinancialMetricsRepository,
    IMapper mapper
    ) : ICompanyService
{
    public async Task<Result<IEnumerable<CompanySearchResult>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        var result = await companyRepository.SearchCompaniesAsync(req.Query);
        
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
        
        var result = await companyRepository.GetCompanyAsync(cik);
        
        if (result.IsFailed)
        {
            return result.ToResult<CompanyDetails>();
        }
        
        var companyDetails = mapper.Map<CompanyDetails>(result.Value);
        return Result.Ok(companyDetails);
    }

    public async Task<Result<CompanyFinancialMetricByPeriod>> GetCompanyFinancialMetricByPeriodAsync(string cik, FinancialMetricType metricType, FinancialMetricPeriodType period)
    {
        var result = await companyFinancialMetricsRepository.GetCompanyFinancialMetricAsync(cik, metricType, period);
        
        if (result.IsFailed)
        {
            return result.ToResult<CompanyFinancialMetricByPeriod>();
        }

        var context = new CompanyFinancialMetricMappingContext 
        { 
            Metric = result.Value,
            PeriodType = period 
        };
        var companyFinancialMetric = mapper.Map<CompanyFinancialMetricByPeriod>(context);
        
        return Result.Ok(companyFinancialMetric);
    }
}