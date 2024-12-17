using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Services;
using SECWatch.Application.Features.Companies;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;
using SECWatch.Infrastructure.Common;
using SECWatch.Infrastructure.Features.Authentication;
using SECWatch.Infrastructure.Features.Authentication.Utils;
using SECWatch.Infrastructure.Features.Communication.Email;
using SECWatch.Infrastructure.Features.Companies;
using SECWatch.Infrastructure.Features.Users;
using SECWatch.Infrastructure.Persistence;
using SECWatch.Infrastructure.Persistence.Configurations;
using StackExchange.Redis;

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
        
        // Add Redis Configuration
        services.Configure<RedisConfiguration>(configuration.GetSection("Redis"));
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisConfig = sp.GetRequiredService<IOptions<RedisConfiguration>>().Value;
            return ConnectionMultiplexer.Connect(redisConfig.ConnectionString);
        });
        
        // Add authentication configuration
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddScheme<JwtBearerOptions, JwtAuthenticationHandler>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var config = configuration;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Secret"]!))
                };
            });
        
        

        // Register infrastructure & utility services
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IEmailService, SendGridEmailService>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Add your DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Register Repositories
        services.AddTransient<ISystemEventRepository, SystemEventRepository>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<ISecCompanyRedisRepository, SecCompanyRedisRepository>();
        services.AddTransient<ISecCompanyRepository, SecCompanyRepository>();

        return services;
    }
}