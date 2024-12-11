namespace SECWatch.Domain.Features.Users;

public record UserToken
{
    public string Token { get; }
    public DateTime Expiry { get; }

    public UserToken(string token, DateTime expiry)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new ArgumentException("Token cannot be empty", nameof(token));
            
        if (expiry <= DateTime.UtcNow)
            throw new ArgumentException("Expiry must be in the future", nameof(expiry));

        Token = token;
        Expiry = expiry;
    }

    public bool IsValid(DateTime currentTime) => currentTime <= Expiry;

    public override string ToString() => Token;
}