using FluentResults;
using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.Application.Features.Alerts.Services;

public interface IAlertRulesService
{
    Task<Result<IReadOnlyList<FilingAlertRuleInfo>>> GetFilingAlertRulesForUser(Guid userId);
    
    Task<Result<FilingAlertRuleInfo>> CreateFilingAlertRuleAsync(Guid userId, TransactFilingAlertRuleInfo rule);
    
    Task<Result> UpdateFilingAlertRuleAsync(Guid userId, TransactFilingAlertRuleInfo rule);
    
    Task<Result> DeleteAlertRuleAsync(Guid userId, Guid ruleId);
}