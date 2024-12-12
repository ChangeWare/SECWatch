namespace SECWatch.Domain.Common;

public record SystemEventQuery(
    DateTime? StartDate, 
    DateTime? EndDate, 
    string? EventType,
    string? Category,
    Guid? EntityId,
    Guid? UserId) 
{
    
}