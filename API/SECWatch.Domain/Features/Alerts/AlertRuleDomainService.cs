using FluentResults;
using SECWatch.Domain.Common.Errors;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts;

public interface IAlertDomainService
{
    Result<AlertRule> CreateFilingRule(Guid userId, Guid companyId, List<string> formTypes, string name, string? description);
    
    Result<AlertRule> UpdateFilingRule(AlertRule rule, Guid userId, List<string> formTypes, string name, string? description);
}

public class AlertRuleDomainService : IAlertDomainService
{
    public Result<AlertRule> CreateFilingRule(Guid userId, Guid companyId, List<string> formTypes, string name, string? description = null)
    {
        if (formTypes == null || !formTypes.Any())
        {
            return Result.Fail(new ValidationError("At least one form type must be specified"));
        }
        
        return AlertRule.CreateFilingRule(userId, companyId, formTypes, name, description);
    }
    
    public Result<AlertRule> UpdateFilingRule(AlertRule existingRule, Guid userId, List<string> formTypes, string name, string? description = null)
    {
        if (!CanUserModifyRule(existingRule, userId))
        {
            return Result.Fail(new AuthorizationError("Unauthorized to modify rule"));
        }
        
        if (formTypes == null || !formTypes.Any())
        {
            return Result.Fail(new ValidationError("At least one form type must be specified"));
        }
        
        return existingRule.Update(formTypes, name, description);
    }
    
    private bool CanUserModifyRule(AlertRule rule, Guid userId)
    {
        return rule.UserId == userId;
    }
}