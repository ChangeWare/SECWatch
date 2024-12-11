using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Users.Events;

public record UserCreatedDomainEvent(string UserId, string Email) : DomainEvent;