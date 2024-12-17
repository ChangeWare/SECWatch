using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Authentication;
using SECWatch.API.Features.Companies.DTOs;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/[controller]")]
//[RequireAuth]
public class CompaniesController(
    ISecApiService secApiService,
    ILogger<CompaniesController> logger) : ControllerBase
{
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<CompanySearchResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Search([FromQuery] string searchTerm, [FromQuery] SearchField searchField)
    {
        var req = new CompanySearchRequest
        {
            SearchTerm = searchTerm,
            SearchField = searchField
        };
        
        if (string.IsNullOrWhiteSpace(req.SearchTerm) || req.SearchTerm.Length < 2)
        {
            return BadRequest("Search term must be at least 2 characters long");
        }

        try
        {
            // TODO: check whether we already have this data
            var companies = await secApiService.SearchCompaniesAsync(req);

            var result = new CompanyResults()
            {
                Companies = companies.Value
            };
       
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company search. Term: {SearchTerm}, Field: {SearchField}", 
                req.SearchTerm, req.SearchField);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}