using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;

namespace SECWatch.Application.Features.Alerts.Services;

public class AlertRulesEngine(IFilingAlertRuleRepository filingAlertRuleRepository) : IAlertRulesEngine
{
    public async Task<IEnumerable<FilingAlertRule>> GetMatchingFilingRulesAsync(FilingEvent filing)
    {
        var rules = await filingAlertRuleRepository.GetActiveRulesForCompanyAsync(filing.Cik);
        
        return rules.Where(rule => 
            rule.IsEnabled && 
            rule.FormTypes.Contains(filing.Data.FormType)
        );
    }
}