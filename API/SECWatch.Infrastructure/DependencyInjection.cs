using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization.Conventions;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Domain.Common.Events;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Users;
using SECWatch.Domain.Features.Users.Models.Preferences;
using SECWatch.Infrastructure.Common;
using SECWatch.Infrastructure.Features.Alerts;
using SECWatch.Infrastructure.Features.Authentication;
using SECWatch.Infrastructure.Features.Authentication.Utils;
using SECWatch.Infrastructure.Features.Communication.Email;
using SECWatch.Infrastructure.Features.Companies.Repositories;
using SECWatch.Infrastructure.Features.Notes;
using SECWatch.Infrastructure.Features.Users;
using SECWatch.Infrastructure.Persistence;
using SECWatch.Infrastructure.Persistence.Configurations;
using SECWatch.Infrastructure.Persistence.Settings;

namespace SECWatch.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
    {
        var jwtConfig = configuration.GetSection("Jwt").Get<JwtTokenConfiguration>();
        if (jwtConfig is null)
        {
            throw new InvalidOperationException("JWT configuration is missing from appsettings");
        }
        services.AddSingleton(jwtConfig);
        
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
        
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();
        
        // Add MongoDB Configuration
        services.Configure<MongoDbSettings>(
            configuration.GetSection("MongoDb"));
        var conventionPack = new ConventionPack { new MongoSnakeCaseElementNameConvention() };
        ConventionRegistry.Register("SnakeCase", conventionPack, _ => true);
        MongoMappings.RegisterMappings();
        
        services.AddHttpClient();
        
        // Register infrastructure & utility services
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();
        services.AddTransient<IEmailRenderer, EmailRenderer>();
        services.AddTransient<IEmailService, MailgunEmailService>();
        
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Add DbContexts
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.AddSingleton<IMongoDbContext, MongoDbContext>();

        // Register Repositories
        services.AddSingleton<ISelectionDataResolver, SelectionDataResolver>();
        services.AddSingleton<IPreferenceDataResolver, PreferenceDataResolver>();
        services.AddTransient<ISystemEventRepository, SystemEventRepository>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<ICompanyRepository, CompanyRepository>();
        services.AddTransient<ICompanyConceptRepository, CompanyConceptRepository>();
        services.AddTransient<INoteRepository, NoteRepository>();
        services.AddTransient<ITrackedCompanyRepository, TrackedCompanyRepository>();
        services.AddTransient<ICompanyUserDashboardPreferencesRepository, CompanyUserDashboardPreferencesRepository>();
        services.AddTransient<IAlertRuleRepository, AlertRuleRepository>();
        services.AddTransient<IAlertNotificationRepository, AlertNotificationRepository>();
        services.AddTransient<INoteTagRepository, NoteTagRepository>();
        
        return services;
    }
}