using SECWatch.Application.Features.Authentication.Services;
using SECWatch.Application.Features.Communication.Services;
using SECWatch.Application.Features.Users.Services;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users.Services;
using SECWatch.Infrastructure;
using SECWatch.Infrastructure.Authentication.Utils;
using SECWatch.Infrastructure.Persistence;
using SECWatch.Infrastructure.Features.Email;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Add application services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserDomainService, UserDomainService>();
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IEmailService, SendGridEmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

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