using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Alerts.DTOs;
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

    public async Task<Result<FilingAlertRuleInfo>> CreateFilingAlertRuleAsync(Guid userId, CreateFilingAlertRuleInfo alertInfo)
    {
        var company = await companyRepository.GetCompanyAsync(alertInfo.Cik);
        
        if (company == null)
        {
            return Result.Fail("Company not found");
        }
        
        var newRule = filingsAlertDomainService.CreateRule(
            userId, 
            company.Id,
            alertInfo.FormTypes,
            alertInfo.Name,
            alertInfo.Description
        );
        
        var result = await filingAlertRuleRepository.AddAsync(newRule);
        
        var resultDto = mapper.Map<FilingAlertRuleInfo>(result);
        
        return Result.Ok(resultDto);
    }
}