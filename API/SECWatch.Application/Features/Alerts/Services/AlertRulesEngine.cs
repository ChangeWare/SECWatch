using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;

namespace SECWatch.Application.Features.Alerts.Services;

public class AlertRulesEngine(IFilingAlertRuleRepository filingAlertRuleRepository) : IAlertRulesEngine
{
    public async Task<ICollection<FilingAlertRuleMatch>> GetFilingsMatchingRules(FilingEvent filingEvent)
    {
        var rules = await filingAlertRuleRepository.GetActiveRulesForCompanyAsync(filingEvent.Cik);
        
        var matches = new List<FilingAlertRuleMatch>();

        foreach (var filing in filingEvent.Filings)
        {
            var match = rules.FirstOrDefault(r => r.FormTypes.Contains(filing.FormType));
            
            if (match is not null)
            {
                matches.Add(new FilingAlertRuleMatch
                {
                    Rule = match,
                    Filing = filing
                });
            }
        }

        return matches;
    }
}