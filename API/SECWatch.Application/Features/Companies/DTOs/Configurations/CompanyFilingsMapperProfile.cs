using AutoMapper;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public class CompanyFilingsMapperProfile : Profile
{
    public CompanyFilingsMapperProfile()
    {
        CreateMap<CompanyFilingHistory, CompanyFilingHistoryDto>()
            .ForMember(dest => dest.Filings,
                opt =>
                    opt.MapFrom(src => src.Filings));

        CreateMap<CompanyFiling, CompanyFilingDto>();
    }
}