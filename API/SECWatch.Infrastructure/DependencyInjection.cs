using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Services;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;
using SECWatch.Infrastructure.Common;
using SECWatch.Infrastructure.Features.Authentication.Utils;
using SECWatch.Infrastructure.Features.Communication.Email;
using SECWatch.Infrastructure.Features.Users;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Add JWT Configuration
        var jwtConfig = configuration.GetSection("Jwt").Get<JwtTokenConfiguration>();
        if (jwtConfig is null)
        {
            throw new InvalidOperationException("JWT configuration is missing from appsettings");
        }
        services.AddSingleton(jwtConfig);

        // Register infrastructure & utility services
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IEmailService, SendGridEmailService>();

        // Add your DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Register Repositories
        services.AddTransient<ISystemEventRepository, SystemEventRepository>();
        services.AddTransient<IUserRepository, UserRepository>();

        return services;
    }
}