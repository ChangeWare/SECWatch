using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Alerts.Models;

public class FilingAlertRule : AggregateRoot
{
    public required Guid UserId { get; set; }
    public required User User { get; set; }
    
    public required Guid CompanyId { get; set; }
    public required Company Company { get; set; }
    
    private List<string> _formTypes = [];
    public IReadOnlyCollection<string> FormTypes => _formTypes.AsReadOnly();
    
    public required bool IsEnabled { get; set; }
    
    public required DateTime CreatedAt { get; set; }
    
    public DateTime? LastTriggeredAt { get; set; }
}