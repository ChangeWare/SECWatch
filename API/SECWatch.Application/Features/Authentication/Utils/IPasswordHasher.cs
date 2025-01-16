namespace SECWatch.Application.Features.Authentication.Utils;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}