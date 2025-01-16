using System.Text.Json;
using FluentResults;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.Application.Features.Users.Services;

public interface IUserService
{
    Task<Result<UserResponse>> RegisterAsync(RegisterUserRequest req);
    Task<Result<UserResponse>> GetByIdAsync(Guid id);
    Task<Result> VerifyEmailAsync(VerifyEmailRequest req);
    
    Task<Result> UpdateUserPreferenceAsync(Guid id, string key, UserPreference preference);
    
    Task<Result<UserPreference>> GetUserPreferenceAsync(Guid id, string key);
}
