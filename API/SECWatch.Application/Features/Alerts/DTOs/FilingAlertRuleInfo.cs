using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Alerts.DTOs;

public record FilingAlertRuleInfo : IAlertRuleInfo
{
    public required Guid Id { get; init; }
    
    public required string Name { get; init; }
    
    public string? Description { get; init; }
    
    public required DateTime CreatedAt { get; init; }

    public required CompanyDetails Company { get; init; }
    
    public required bool IsEnabled { get; init; }
    
    public required List<string> FormTypes { get; init; }
    
    public DateTime? LastTriggeredAt { get; init; }
}