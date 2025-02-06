using System.Text.Json.Serialization;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "EventType")]
[JsonDerivedType(typeof(FilingAlertNotificationInfo), (int)AlertNotificationType.FilingAlert)]
public abstract record AlertNotificationInfo
{
    public Guid Id { get; init; }
    
    public Guid RuleId { get; init; }
    
    public DateTime CreatedAt { get; init; }
    
    public AlertNotificationType EventType { get; init; }
    
    public bool IsViewed { get; init; }
    
    public bool IsDismissed { get; init; }
}