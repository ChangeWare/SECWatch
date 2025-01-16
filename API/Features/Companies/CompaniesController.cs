using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Authentication;
using SECWatch.API.Features.Companies.DTOs;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies.Queries;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/[controller]")]
[RequireAuth]
public class CompaniesController(
    ICompanyService companyService,
    ICompanyTrackingService companyTrackingService,
    ILogger<CompaniesController> logger) : ControllerBase
{
    
    [HttpGet("{cik}/details")]
    [ProducesResponseType(typeof(CompanyDetails), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetails(string cik)
    {
        var userId = User.GetUserId();

        var result = await companyService.GetCompanyDetailsAsync(userId, cik);
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }
        
        if (result.Value == null)
        {
            return NotFound();
        }
        
        var response = new CompanyDetailsResponse()
        {
            Company = result.Value
        };

        return Ok(response);

    }
    
    [HttpPost("{cik}/track")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> TrackCompany(string cik)
    {
        var userId = User.GetUserId();
        var result = await companyTrackingService.TrackCompanyAsync(cik, userId);
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }
        
        var response = new CompanyDetailsResponse()
        {
            Company = result.Value
        };

        return Ok(response);
    }
    
    [HttpPost("{cik}/untrack")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UntrackCompany(string cik)
    {
        var userId = User.GetUserId();
        var result = await companyTrackingService.UntrackCompanyAsync(cik, userId);
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }
        
        var response = new CompanyDetailsResponse()
        {
            Company = result.Value
        };

        return Ok(response);
    }
    
    [HttpGet("tracked")]
    [ProducesResponseType(typeof(TrackedCompaniesResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTrackedCompanies()
    {
        var userId = User.GetUserId();
        var result = await companyTrackingService.GetTrackedCompaniesAsync(userId);
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }

        var response = new TrackedCompaniesResponse()
        {
            TrackedCompanies = result.Value
        };

        return Ok(response);
    }
    
    [HttpGet("{cik}/filings/history")]
    [ProducesResponseType(typeof(CompanyFilingHistoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFilingsHistory(string cik)
    {
        try
        {
            var result = await companyService.GetCompanyFilingHistoryAsync(cik);
            if (result.IsFailed)
            {
                return BadRequest(result.Errors);
            }
            
            if (result.Value == null)
            {
                return NotFound();
            }
            
            var response = new CompanyFilingHistoryResponse()
            {
                FilingHistory = result.Value
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company filings history for CIK: {CIK}", cik);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    
    
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<CompanySearchResult>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Search([FromQuery] string searchTerm, [FromQuery] SearchField searchField)
    {
        var req = new CompanySearchRequest
        {
            Query = new CompanySearchQuery()
            {
                SearchTerm = searchTerm,
                SearchField = searchField
            }
        };
        
        if (string.IsNullOrWhiteSpace(req.Query.SearchTerm) || req.Query.SearchTerm.Length < 2)
        {
            return BadRequest("Search term must be at least 2 characters long");
        }

        try
        {
            var companies = await companyService.SearchCompaniesAsync(req);

            var result = new CompanySearchResponse()
            {
                Companies = companies.Value
            };
       
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing company search. Term: {SearchTerm}, Field: {SearchField}", 
                req.Query.SearchTerm, req.Query.SearchField);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}