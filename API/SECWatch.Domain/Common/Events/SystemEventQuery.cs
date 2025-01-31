namespace SECWatch.Domain.Common.Events;

public record SystemEventQuery(
    DateTime? StartDate, 
    DateTime? EndDate, 
    string? EventType,
    string? Category,
    Guid? EntityId,
    Guid? UserId) 
{
    
}