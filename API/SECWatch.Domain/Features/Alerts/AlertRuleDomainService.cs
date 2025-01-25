using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts;

public interface IAlertDomainService
{
    AlertRule CreateRule(Guid userId, Guid companyId, List<string> formTypes, string name, string? description);
}

public class AlertRuleDomainService : IAlertDomainService
{
    public AlertRule CreateRule(Guid userId, Guid companyId, List<string> formTypes, string name, string? description = null)
    {
        return AlertRule.CreateFilingRule(userId, companyId, formTypes, name, description);
    }
}