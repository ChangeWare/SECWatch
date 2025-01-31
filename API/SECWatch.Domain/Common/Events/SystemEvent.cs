namespace SECWatch.Domain.Common.Events;

/// <summary>
/// Tracks events that occur in the system.
/// </summary>e
public class SystemEvent
{
    public Guid Id { get; init; } 
    
    public Guid? UserId { get; init; }
    
    public Guid EntityId { get; init; }
    
    public DateTime OccurredAt { get; init; } 
    
    public string EventType { get; init; }
    
    public string Category { get; init; }
    
    public Dictionary<string, string> EventMetadata { get; init; }

    private SystemEvent()
    {
    }
    
    public static SystemEvent Create(
        Guid entityId, 
        Guid? userId,
        string eventType, 
        string category, 
        Dictionary<string, string> eventMetadata)
    {
        return new SystemEvent
        {
            Id = Guid.NewGuid(),
            EntityId = entityId,
            UserId = userId,
            OccurredAt = DateTime.UtcNow,
            EventType = eventType,
            Category = category,
            EventMetadata = eventMetadata
        };
    }
}