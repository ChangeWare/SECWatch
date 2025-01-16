using AutoMapper;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs.Configurations;

public class TrackedCompanyMapperProfile : Profile
{
    public TrackedCompanyMapperProfile()
    {
        CreateMap<TrackedCompany, TrackedCompanyDetails>()
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.Company));
    }
    
}