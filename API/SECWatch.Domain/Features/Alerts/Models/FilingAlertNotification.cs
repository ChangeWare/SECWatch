using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Alerts.Models;

public class FilingAlertNotification : AggregateRoot
{
    public required Guid FilingAlertRuleId { get; set; }
    public FilingAlertRule FilingAlertRule { get; set; }
    
    public required string CompanyCik { get; set; }
    
    public required Guid UserId { get; set; }
    public User User { get; set; }
    
    public required string EventId { get; set; }
    public required string EventType { get; set; }
    
    public required string FormType { get; set; }
    
    public required DateTime FilingDate { get; set; }

    public required bool IsViewed { get; set; } = false;
    public required bool IsEmailSent { get; set; } = false;
    public required bool IsDismissed { get; set; } = false;
    
    public required DateTime CreatedAt { get; set; }
    public DateTime? ViewedAt { get; set; }
}