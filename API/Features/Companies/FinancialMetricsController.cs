using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Companies.DTOs;
using SECWatch.Application.Features.Companies;
using SECWatch.Domain.Features.Companies;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/financials")]
public class FinancialMetricsController(
    ICompanyService companyService,
    ILogger<FinancialMetricsController> logger) : ControllerBase
{
    [HttpGet("companies/{cik}/metrics/{metric}")]
    [ProducesResponseType(typeof(CompanyFinancialMetricResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFinancialMetric(string cik, FinancialMetricType metric)
    {
        try
        {
            var result = await companyService.GetCompanyFinancialMetricAsync(cik, metric);
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