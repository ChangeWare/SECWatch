using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SECWatch.Application.Common.Events;
using SECWatch.Application.Features.Authentication.Services;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Notes;
using SECWatch.Application.Features.Users.Services;
using SECWatch.Domain.Features.Users.Services;

namespace SECWatch.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IMetricMetadataFactory, MetricMetadataFactory>();
        
        services.AddTransient<ISystemEventService, SystemEventService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserDomainService, UserDomainService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddTransient<HttpClient>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<INoteService, NoteService>();
        services.AddScoped<ICompanyTrackingService, CompanyTrackingService>();

        return services;
    }
}