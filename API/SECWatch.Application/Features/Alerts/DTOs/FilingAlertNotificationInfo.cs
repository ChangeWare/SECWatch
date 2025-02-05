using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.DTOs;

public record FilingAlertNotificationInfo : IAlertNotificationInfo
{
    public required Guid Id { get; init; }
    
    public required Guid RuleId { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required AlertNotificationType EventType { get; init; }
    
    public required CompanyDetails Company { get; init; }
    
    public required string FormType { get; init; }
    
    public required DateTime FilingDate { get; init; }
    
    public required string AccessionNumber { get; init; }
    
    public required bool IsViewed { get; init; }
    
    public required bool IsEmailSent { get; init; }
    
    public required bool IsDismissed { get; init; }
    
    public DateTime? ViewedAt { get; init; }
    
    
}