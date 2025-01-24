using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Alerts;

public class FilingAlertRuleRepository(ApplicationDbContext dbContext) : IFilingAlertRuleRepository
{
    public async Task<IReadOnlyList<FilingAlertRule>> GetActiveRulesForCompanyAsync(string cik)
    {
        return await dbContext.FilingAlertRules
            .Where(r => 
                r.Company.Cik == cik && 
                r.IsEnabled)
            .ToListAsync();
    }
}