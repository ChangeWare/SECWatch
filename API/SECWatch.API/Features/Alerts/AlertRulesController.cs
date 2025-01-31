using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Common;
using SECWatch.API.Features.Alerts.DTOs;
using SECWatch.API.Features.Authentication;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Alerts.DTOs;
using SECWatch.Application.Features.Alerts.Services;

namespace SECWatch.API.Features.Alerts;

[ApiController]
[Route("api/alerts/rules")]
[RequireAuth]
public class AlertRulesController(IAlertRulesService alertRulesService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(UserAlertRulesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserAlertRulesResponse>> GetUserAlertRules()
    {
        var userId = User.GetUserId();
        
        var result = await alertRulesService.GetFilingAlertRulesForUser(userId);
        
        return result.ToActionResponse(rules => new UserAlertRulesResponse 
        { 
            Rules = rules 
        });
    }
    
    [HttpPut("{ruleId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAlertRule(Guid ruleId, [FromBody] UpdateAlertRuleRequest request)
    {
        var userId = User.GetUserId();
        
        if (request.Rule.Id != ruleId)
        {
            return BadRequest("Rule ID in the request body does not match the rule ID in the URL");
        }
        
        var result = request.Rule switch
        {
            TransactFilingAlertRuleInfo filingData => 
                await alertRulesService.UpdateFilingAlertRuleAsync(userId, filingData),
            _ => throw new ArgumentException($"Unsupported alert type: {request.Rule.GetType()}")
        };
        
        return result.ToActionResult();
    }
    
    [HttpDelete("{ruleId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteAlertRule(Guid ruleId)
    {
        var userId = User.GetUserId();
        
        var result = await alertRulesService.DeleteAlertRuleAsync(userId, ruleId);
        
        return result.ToActionResult();
    }
    
    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateAlertRuleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateAlertRuleResponse>>CreateFilingAlertRule([FromBody]CreateAlertRuleRequest request)
    {
        var userId = User.GetUserId();
        
        var result = request.Rule switch
        {
            TransactFilingAlertRuleInfo filingData => await alertRulesService.CreateFilingAlertRuleAsync(userId, filingData),
            _ => throw new ArgumentException($"Unsupported alert type: {request.Rule.GetType()}")
        };

        return result.ToActionResponse(rule => new CreateAlertRuleResponse
        { 
            Rule = rule 
        });
    }
}