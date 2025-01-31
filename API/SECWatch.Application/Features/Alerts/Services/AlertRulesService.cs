using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Alerts.DTOs;
using SECWatch.Domain.Common.Errors;
using SECWatch.Domain.Features.Alerts;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Alerts.Services;

public class AlertRulesService(
    IAlertRuleRepository filingAlertRuleRepository,
    ICompanyRepository companyRepository,
    IMapper mapper,
    IAlertDomainService filingsAlertDomainService
    ) : IAlertRulesService
{
    public async Task<Result<IReadOnlyList<FilingAlertRuleInfo>>> GetFilingAlertRulesForUser(Guid userId)
    {
        var rules = await filingAlertRuleRepository.GetFilingAlertRulesForUserAsync(userId);
        
        var rulesDto = mapper.Map<IReadOnlyList<FilingAlertRuleInfo>>(rules);
        
        return Result.Ok(rulesDto);
    }

    public async Task<Result<FilingAlertRuleInfo>> CreateFilingAlertRuleAsync(Guid userId, TransactFilingAlertRuleInfo alertInfo)
    {
        var company = await companyRepository.GetCompanyAsync(alertInfo.Cik);
        
        if (company == null)
        {
            return Result.Fail(new NotFoundError("Company not found"));
        }
        
        var newRuleResult = filingsAlertDomainService.CreateFilingRule(
            userId, 
            company.Id,
            alertInfo.FormTypes,
            alertInfo.Name,
            alertInfo.Description
        );
        
        if (newRuleResult.IsFailed)
        {
            return Result.Fail(newRuleResult.Errors);
        }
        
        var result = await filingAlertRuleRepository.AddAsync(newRuleResult.Value);
        
        var resultDto = mapper.Map<FilingAlertRuleInfo>(result);
        
        return Result.Ok(resultDto);
    }

    public async Task<Result> UpdateFilingAlertRuleAsync(Guid userId, TransactFilingAlertRuleInfo rule)
    {
        if (!rule.Id.HasValue || rule.Id == Guid.Empty)
        {
            return Result.Fail(new ValidationError("Invalid rule id"));
        }

        var ruleId = rule.Id!.Value;
        
        var existingRule = await filingAlertRuleRepository.GetFilingAlertRuleAsync(ruleId);
        
        if (existingRule == null)
        {
            return Result.Fail(new NotFoundError("Rule not found"));
        }
        
        var company = await companyRepository.GetCompanyAsync(rule.Cik);
        
        if (company == null)
        {
            return Result.Fail(new NotFoundError("Company not found"));
        }
        
        var updateRuleResult = filingsAlertDomainService.UpdateFilingRule(
            existingRule,
            userId,
            rule.FormTypes,
            rule.Name,
            rule.Description
        );
        
        if (updateRuleResult.IsFailed)
        {
            return Result.Fail(updateRuleResult.Errors);
        }
        
        var result = await filingAlertRuleRepository.UpdateAsync(updateRuleResult.Value);
        
        if (result == null)
        {
            return Result.Fail(new InternalError("Failed to update rule"));
        }
        
        return Result.Ok();
    }

    public async Task<Result> DeleteAlertRuleAsync(Guid userId, Guid ruleId)
    {
        var rule = await filingAlertRuleRepository.GetFilingAlertRuleAsync(ruleId);
        
        if (rule == null)
        {
            return Result.Fail(new NotFoundError("Rule not found"));
        }
        
        if (rule.UserId != userId)
        {
            return Result.Fail(new AuthorizationError("User is not authorized to delete this rule"));
        }
        
        await filingAlertRuleRepository.DeleteAsync(rule);
        
        return Result.Ok();
    }
}