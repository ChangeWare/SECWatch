namespace SECWatch.Application.Features.Users.DTOs;

public record RegisterUserRequest(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string Password
);