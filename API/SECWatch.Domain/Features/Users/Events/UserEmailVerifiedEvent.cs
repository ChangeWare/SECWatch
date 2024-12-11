using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Users.Events;

public record UserEmailVerifiedDomainEvent(string UserId, string Email) : DomainEvent;