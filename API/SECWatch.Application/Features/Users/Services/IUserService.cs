using FluentResults;
using SECWatch.Application.Features.Users.DTOs;

namespace SECWatch.Application.Features.Users.Services;

public interface IUserService
{
    Task<Result<UserResponse>> RegisterAsync(RegisterUserRequest req);
    Task<Result<UserResponse>> GetByIdAsync(Guid id);
    Task<Result> VerifyEmailAsync(VerifyEmailRequest req);
}
