using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization.Conventions;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Services;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Users;
using SECWatch.Infrastructure.Common;
using SECWatch.Infrastructure.Features.Authentication;
using SECWatch.Infrastructure.Features.Authentication.Utils;
using SECWatch.Infrastructure.Features.Communication.Email;
using SECWatch.Infrastructure.Features.Companies;
using SECWatch.Infrastructure.Features.Notes;
using SECWatch.Infrastructure.Features.Users;
using SECWatch.Infrastructure.Persistence;
using SECWatch.Infrastructure.Persistence.Configurations;
using SECWatch.Infrastructure.Persistence.Settings;
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
        
        // Add MongoDB Configuration
        services.Configure<MongoDbSettings>(
            configuration.GetSection("MongoDb"));
        var conventionPack = new ConventionPack { new MongoSnakeCaseElementNameConvention() };
        ConventionRegistry.Register("SnakeCase", conventionPack, _ => true);
        MongoMappings.RegisterMappings();
        
        // First configure all the JWT options
        var jwtSection = configuration.GetSection("Jwt");
        
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Secret"]!)),
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // Do authentication setup and scheme registration in one chain
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddScheme<JwtBearerOptions, JwtAuthenticationHandler>(
                JwtBearerDefaults.AuthenticationScheme, 
                options => options.TokenValidationParameters = tokenValidationParameters);
        

        // Make sure this runs AFTER AddJwtBearer
        services.AddScoped<JwtBearerHandler, JwtAuthenticationHandler>();
        
        services.AddHttpClient();
        
        // Register infrastructure & utility services
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IEmailService, SendGridEmailService>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Add DbContexts
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.AddSingleton<IMongoDbContext, MongoDbContext>();

        // Register Repositories
        services.AddTransient<ISystemEventRepository, SystemEventRepository>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<ICompanyRepository, CompanyRepository>();
        services.AddTransient<ICompanyFinancialMetricsRepository, CompanyFinancialMetricsRepository>();
        services.AddTransient<INoteRepository, NoteRepository>();
        
        return services;
    }
}