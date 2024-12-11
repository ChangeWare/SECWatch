using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Domain.Features.Users;
using SECWatch.Infrastructure.Authentication.Utils;
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

        // Register JWT Token Generator
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();

        // Add your DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Register Repositories
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}