using AutoMapper;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public class CompanyMapperProfile : Profile
{
    public CompanyMapperProfile()
    {
        CreateMap<Company, CompanySearchResult>();      
        CreateMap<Company, CompanyDetails>();
    }
}