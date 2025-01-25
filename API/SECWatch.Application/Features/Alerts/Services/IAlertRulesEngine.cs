using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.Services;

public interface IAlertRulesEngine
{
    Task<ICollection<FilingAlertRuleMatch>> GetFilingsMatchingRules(FilingEvent filing);
}

