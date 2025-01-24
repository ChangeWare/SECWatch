namespace AlertWorkerService.Contracts;

public record FilingAlertNotificationEvent
{
    public required Guid AlertRuleId { get; init; }
    
    public required Guid UserId { get; init; }
    
    public required string CompanyCik { get; init; }
    
    public required string EventId { get; init; }
    
    public required string FormType { get; init; }
    
    public required DateTime FilingDate { get; init; }
    
    public required string AccessionNumber { get; init; }
    
}