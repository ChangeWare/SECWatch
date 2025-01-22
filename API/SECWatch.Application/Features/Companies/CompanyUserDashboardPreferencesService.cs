using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Companies;

public class CompanyUserDashboardPreferencesService(
        ICompanyUserDashboardPreferencesRepository repository,
        ICompanyRepository companyRepository,
        IMapper mapper
    ) : ICompanyUserDashboardPreferencesService
{
    public async Task<Result<CompanyUserDashboardPreferencesDto>> AddConceptToDashboard(string cik, Guid userId, string conceptType)
    {
        // Get the user's existing preferences
        var existingPreferences = await repository.GetCompanyDashboardPreferencesForUser(userId, cik);

        if (existingPreferences == null)
        {
            return Result.Fail("User company dashboard preferences not found");
        }
        
        // Add the concept to the user's preferences
        existingPreferences.AddPinnedConcept(conceptType);

        var result = await repository.UpsertAsync(existingPreferences);
        
        if (result == null)
        {
            return Result.Fail("Failed to add concept to dashboard");
        }
        
        var preferencesDto = mapper.Map<CompanyUserDashboardPreferencesDto>(existingPreferences);
        
        return Result.Ok(preferencesDto);
    }

    public async Task<Result<CompanyUserDashboardPreferencesDto>> GetCompanyDashboardPreferencesForUser(string cik, Guid userId)
    {
        var preferences = await repository.GetCompanyDashboardPreferencesForUser(userId, cik);

        if (preferences == null)
        {
            // Get the company
            var company = await companyRepository.GetCompanyAsync(cik);
            
            if (company == null)
            {
                return Result.Fail("Company not found");
            }
            
            // Create new preferences for the user
            preferences = await repository.UpsertAsync(CompanyUserDashboardPreferences.Create(userId, company.Id));
            
            if (preferences == null)
            {
                return Result.Fail("User company dashboard preferences did not exist and failed to create.");
            }
        }

        var preferencesDto = mapper.Map<CompanyUserDashboardPreferencesDto>(preferences);

        return Result.Ok(preferencesDto);
    }
}