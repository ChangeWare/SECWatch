using AutoMapper;
using SECWatch.Domain.Features.Companies;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public record CompanyFinancialMetricMappingContext
{
    public required CompanyFinancialMetric Metric { get; init; }
    public required FinancialMetricPeriodType PeriodType { get; init; }
}

public class CompanyFinancialMetricMapperProfile : Profile
{
    public CompanyFinancialMetricMapperProfile()
    {
        CreateMap<CompanyFinancialMetricMappingContext, CompanyFinancialMetricByPeriod>()
            .ForMember(dest => dest.Cik, opt => opt.MapFrom(src => src.Metric.Cik))
            .ForMember(dest => dest.MetricType, opt => opt.MapFrom(src => src.Metric.MetricType))
            .ForMember(dest => dest.LastValue, opt => opt.MapFrom(src => src.Metric.Metadata.LastValue))
            .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => src.Metric.Metadata.LastUpdated))
            .ForMember(dest => dest.LastReported, opt => opt.MapFrom(src => src.Metric.Metadata.LastReported))
            .ForMember(dest => dest.DataPoints, opt => opt.MapFrom(src => src.Metric.DataPoints))
            .ForMember(d => d.PeriodType, o => o.MapFrom(s => s.PeriodType));
    }
}