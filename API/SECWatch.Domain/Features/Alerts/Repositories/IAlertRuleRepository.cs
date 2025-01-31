using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IAlertRuleRepository
{
    Task<IReadOnlyList<AlertRule>> GetActiveFilingAlertRulesForCompanyAsync(string cik);
    
    Task<IReadOnlyList<AlertRule>> GetFilingAlertRulesForUserAsync(Guid userId);
    
    Task<AlertRule?> GetFilingAlertRuleAsync(Guid ruleId);
    
    Task<AlertRule> AddAsync(AlertRule rule);
    
    Task<AlertRule> UpdateAsync(AlertRule rule);
    
    Task DeleteAsync(AlertRule rule);
}