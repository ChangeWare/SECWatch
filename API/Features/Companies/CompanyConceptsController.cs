using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Companies.DTOs;
using SECWatch.Application.Features.Companies;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/concepts")]
public class CompanyConceptsController(
    ICompanyService companyService,
    ILogger<CompanyConceptsController> logger) : ControllerBase
{
    [HttpGet("company/{cik}")]
    [ProducesResponseType(typeof(CompanyConceptsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCompanyConcepts(string cik)
    {
        try
        {
            var result = await companyService.GetCompanyConceptsAsync(cik);
            if (result.IsFailed)
            {
                return BadRequest(result.Errors);
            }
            
            if (result.Value == null)
            {
                return NotFound();
            }
            
            var response = new CompanyConceptsResponse()
            {
                Concepts = result.Value
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company concept types for CIK: {CIK}", cik);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpGet("{conceptType}/company/{cik}")]
    [ProducesResponseType(typeof(CompanyConceptResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetFinancialMetric(string cik, string conceptType)
    {
        try
        {
            var result = await companyService.GetCompanyConceptAsync(cik, conceptType);
            if (result.IsFailed)
            {
                return BadRequest(result.Errors);
            }
            
            if (result.Value == null)
            {
                return NotFound();
            }
            
            var response = new CompanyConceptResponse()
            {
                Concept = result.Value,
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company concept for CIK: {CIK}, Concept Type: {Metric}", cik, conceptType);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}