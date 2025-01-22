using AutoMapper;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public class CompanyUserDashboardPreferencesMapperProfile : Profile
{
    public CompanyUserDashboardPreferencesMapperProfile()
    {
        CreateMap<CompanyUserDashboardPreferences, CompanyUserDashboardPreferencesDto>();
    }
}