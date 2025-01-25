using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IAlertRuleRepository
{
    Task<IReadOnlyList<AlertRule>> GetActiveFilingAlertRulesForCompanyAsync(string cik);
    
    Task<IReadOnlyList<AlertRule>> GetFilingAlertRulesForUserAsync(Guid userId);
    
    Task<AlertRule> AddAsync(AlertRule rule);
}