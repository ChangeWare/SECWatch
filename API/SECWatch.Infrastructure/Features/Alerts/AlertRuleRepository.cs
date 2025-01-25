using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Alerts;

public class AlertRuleRepository(ApplicationDbContext dbContext) : IAlertRuleRepository
{
    public async Task<IReadOnlyList<AlertRule>> GetActiveFilingAlertRulesForCompanyAsync(string cik)
    {
        return await dbContext.AlertRules
            .Where(r => 
                r.Company.Cik == cik && 
                r.IsEnabled &&
               r.Type == AlertRuleTypes.FilingAlert)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<AlertRule>> GetFilingAlertRulesForUserAsync(Guid userId)
    {
        return await dbContext.AlertRules
            .Where(r => r.UserId == userId && r.Type == AlertRuleTypes.FilingAlert)
            .Include(r => r.Company)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<AlertRule> AddAsync(AlertRule rule)
    {
        var entry = await dbContext.AlertRules.AddAsync(rule);
        await dbContext.SaveChangesAsync();
        return entry.Entity;
    }
}