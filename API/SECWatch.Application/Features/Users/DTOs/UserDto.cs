namespace SECWatch.Application.Features.Users.DTOs;

public record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    bool EmailVerified,
    DateTime CreatedAt
);