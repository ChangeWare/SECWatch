namespace SECWatch.Domain.Common;

public abstract record DomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
    
    public string EventType => GetType().Name;
}