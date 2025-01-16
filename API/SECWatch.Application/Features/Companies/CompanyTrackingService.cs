using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Companies;

public class CompanyTrackingService(
    ICompanyRepository companyRepository,
    ITrackedCompanyRepository trackedCompanyRepository,
    IMapper mapper) : ICompanyTrackingService
{
    public async Task<Result<CompanyDetails>> TrackCompanyAsync(string cik, Guid userId)
    {
        var company = await companyRepository.GetCompanyAsync(cik);
        if (company == null)
        {
            return Result.Fail("Company not found");
        }
        
        // Make sure the company is not already tracked
        var existingTrackedCompany = await trackedCompanyRepository.GetTrackedCompanyByCikForUser(cik, userId);
        if (existingTrackedCompany != null)
        {
            return Result.Fail("Company already tracked");
        }
        

        var trackedCompany = TrackedCompany.Create(userId, company.Id);
        
        var result = await trackedCompanyRepository.AddAsync(trackedCompany);
        
        if (result == null)
        {
            return Result.Fail("Failed to track company");
        }
        
        var companyDetails = mapper.Map<CompanyDetails>(company);
        companyDetails.IsTracked = true;
        
        return Result.Ok(companyDetails);
    }

    public async Task<Result<CompanyDetails>> UntrackCompanyAsync(string cik, Guid userId)
    {
        var company = await companyRepository.GetCompanyAsync(cik);
        
        if (company == null)
        {
            return Result.Fail("Company not found");
        }
        
        var result = await trackedCompanyRepository.RemoveAsync(userId, company.Id);
        
        var companyDetails = mapper.Map<CompanyDetails>(company);
        companyDetails.IsTracked = false;
        
        return result ?  Result.Ok(companyDetails) : Result.Fail("Failed to untrack company");
    }

    public async Task<Result<IReadOnlyList<TrackedCompanyDetails>>> GetTrackedCompaniesAsync(Guid userId)
    {
        var trackedCompanies = await trackedCompanyRepository.GetTrackedCompaniesForUser(userId);
        
        var trackedCompanyDetails = mapper.Map<List<TrackedCompanyDetails>>(trackedCompanies);
        
        var trackedCompanyCiks = trackedCompanyDetails.Select(tc => tc.Company.CIK).ToList();

        var mostRecentFilings = await companyRepository.GetCompaniesMostRecentFilingsAsync(trackedCompanyCiks);

        trackedCompanyDetails.ForEach(tc =>
        {
            var mostRecentFiling = mostRecentFilings.GetValueOrDefault(tc.Company.CIK);
            var mostRecentFilingDto = mapper.Map<CompanyFilingDto>(mostRecentFiling);
            tc.MostRecentFiling = mostRecentFilingDto;
            tc.LastEvent = tc.MostRecentFiling?.FilingDate ?? tc.Company.LastUpdated;
        });
        
        return Result.Ok<IReadOnlyList<TrackedCompanyDetails>>(trackedCompanyDetails);
    }
}