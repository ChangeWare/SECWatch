using Microsoft.AspNetCore.Mvc;
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
        
        if (result.IsFailed)
        {
            return NotFound(result.Errors);
        }

        var response = new UserAlertRulesResponse()
        {
            Rules = result.Value
        };

        return Ok(response);
    }
    
    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateFilingAlertRuleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FilingAlertRuleInfo>>CreateFilingAlertRule([FromBody]CreateAlertRuleRequest request)
    {
        var userId = User.GetUserId();
        
        var result = request.Rule switch
        {
            CreateFilingAlertRuleInfo filingData => await alertRulesService.CreateFilingAlertRuleAsync(userId, filingData),
            _ => throw new ArgumentException($"Unsupported alert type: {request.Rule.GetType()}")
        };
        
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }
        
        return Ok(result.Value);
    }
}