using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Alerts.Models;

public class AlertRule : AggregateRoot
{
    public required Guid UserId { get; set; }
    public User User { get; set; }
    
    public required Guid CompanyId { get; set; }
    public Company Company { get; set; }
    
    public required AlertRuleTypes Type { get; set; }
    
    public required string Name { get; set; }
    
    public string? Description { get; set; }
    
    private List<string> _formTypes = [];
    public IReadOnlyCollection<string> FormTypes => _formTypes.AsReadOnly();
    
    public required bool IsEnabled { get; set; }
    
    public required DateTime CreatedAt { get; set; }
    
    public DateTime? LastTriggeredAt { get; set; }

    internal static AlertRule CreateFilingRule(Guid userId, Guid companyId, List<string> formTypes, string name, string? description = null)
    {
        return new AlertRule
        {
            Type = AlertRuleTypes.FilingAlert,
            UserId = userId,
            CompanyId = companyId,
            IsEnabled = true,
            CreatedAt = DateTime.UtcNow,
            _formTypes = formTypes,
            Name = name,
            Description = description
        };
    }
    
    private AlertRule()
    {
    }
}