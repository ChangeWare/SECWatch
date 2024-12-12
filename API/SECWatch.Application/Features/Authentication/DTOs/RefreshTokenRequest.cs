namespace SECWatch.Application.Features.Authentication.DTOs;

public record RefreshTokenRequest(string Token, string RefreshToken);