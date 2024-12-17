using AutoMapper;

namespace SECWatch.Application.Features.Companies.DTOs;

public class CompanyMapperProfile : Profile
{
    public CompanyMapperProfile()
    {
        CreateMap<CompanyInfo, CompanySearchResponse>();      
    }
}