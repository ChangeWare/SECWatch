using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SECWatch.Application.Common;
using SECWatch.Application.Features.Authentication.Services;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Users.Services;
using SECWatch.Domain.Features.Users.Services;
using SECWatch.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add development CORS policy
var allowedOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins!) // Read from configuration
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add infrastructure (repositories, infrastructure services, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Setup application & domain services
builder.Services.AddTransient<ISystemEventService, SystemEventService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserDomainService, UserDomainService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddTransient<HttpClient>();
builder.Services.AddScoped<ISecApiService, SecApiService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();