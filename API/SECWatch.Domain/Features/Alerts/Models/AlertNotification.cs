using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Alerts.Models;

public class AlertNotification : AggregateRoot
{
    public Guid? AlertRuleId { get; set; }
    public AlertRule AlertRule { get; set; }
    
    public required string CompanyCik { get; set; }
    
    public required Guid UserId { get; set; }
    public User User { get; set; }
    
    public required string EventId { get; set; }
    public required AlertNotificationType EventType { get; set; }
    
    public required string FormType { get; set; }
    
    public required string AccessionNumber { get; set; }
    
    public required DateTime FilingDate { get; set; }

    public required bool IsViewed { get; set; } = false;
    public required bool IsEmailSent { get; set; } = false;
    public required bool IsDismissed { get; set; } = false;
    
    public required DateTime CreatedAt { get; set; }
    public DateTime? ViewedAt { get; set; }
}