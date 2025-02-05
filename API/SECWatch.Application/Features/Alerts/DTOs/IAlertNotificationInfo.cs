using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.DTOs;

public interface IAlertNotificationInfo
{
    public Guid Id { get; init; }
    
    public Guid RuleId { get; init; }
    
    public DateTime CreatedAt { get; init; }
    
    public AlertNotificationType EventType { get; init; }
    
    public bool IsViewed { get; init; }
    
    public bool IsDismissed { get; init; }
    
}