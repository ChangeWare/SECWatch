using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SECWatch.API.Common;
using SECWatch.API.Features.Alerts.DTOs;
using SECWatch.API.Features.Dev;
using SECWatch.Application;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Users.Models.Infrastructure;
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

builder.Services.AddControllers(options =>
{
    options.ModelBinderProviders.Insert(0, new CsvListModelBinderProvider());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add infrastructure (repositories, infrastructure services, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Add application & domain services
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapEmailPreviewEndpoints();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();