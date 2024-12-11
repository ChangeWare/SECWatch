using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Users.Events;

public record UserPasswordResetDomainEvent(string UserId, string Email) : DomainEvent;