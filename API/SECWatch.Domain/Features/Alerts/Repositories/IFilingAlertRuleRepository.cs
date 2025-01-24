using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IFilingAlertRuleRepository
{
    Task<IReadOnlyList<FilingAlertRule>> GetActiveRulesForCompanyAsync(string cik);
}