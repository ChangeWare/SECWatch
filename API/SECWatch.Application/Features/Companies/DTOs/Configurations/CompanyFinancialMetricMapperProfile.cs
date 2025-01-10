using AutoMapper;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public class CompanyFinancialMetricMapperProfile : Profile
{
    public CompanyFinancialMetricMapperProfile()
    {
        CreateMap<CompanyFinancialMetric, CompanyFinancialMetricDto>()
            .ForMember(dest => dest.LastUpdated,
                opt =>
                    opt.MapFrom(src => src.Metadata.LastUpdated))
            .ForMember(dest => dest.LastReported,
                opt =>
                    opt.MapFrom(src => src.Metadata.LastReported))
            .ForMember(dest => dest.LastValue,
                opt =>
                    opt.MapFrom(src => src.Metadata.LastValue))
            .ForMember(dest => dest.CurrencyTypes,
                opt =>
                    opt.MapFrom(src => src.Metadata.CurrencyTypes));
    }
}