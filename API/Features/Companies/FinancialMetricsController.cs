using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Companies.DTOs;
using SECWatch.Application.Features.Companies;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/[controller]")]
public class FinancialMetricsController(
    ICompanyService companyService,
    ILogger logger) : ControllerBase
{
    [HttpGet("{metric}/{period}/{cik}")]
    [ProducesResponseType(typeof(CompanyFinancialMetricResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFinancialMetric(string cik, FinancialMetricType metric, FinancialMetricPeriodType period)
    {
        try
        {
            var result = await companyService.GetCompanyFinancialMetricByPeriodAsync(cik, metric, period);
            if (result.IsFailed)
            {
                return BadRequest(result.Errors);
            }
            
            if (result.Value == null)
            {
                return NotFound();
            }
            
            var response = new CompanyFinancialMetricResponse()
            {
                Metric = result.Value
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company financial metric for CIK: {CIK}, Metric: {Metric}", cik, metric);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}