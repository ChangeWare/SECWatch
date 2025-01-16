using AutoMapper;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Application.Features.Users.DTOs.Configurations;

public class UserMapperProfile : Profile
{
    public UserMapperProfile()
    {
        CreateMap<User, UserDto>();
    }
}