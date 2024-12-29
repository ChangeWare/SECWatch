
using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/[controller]")]
public class FinancialMetricsController : ControllerBase
{
    [HttpGet("{cik}/accounts-payable")]
    public async Task<ActionResult<AccountsPayableResponse>> GetAccountsPayable(
        string cik,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] string period = "quarterly")
    {
        // TODO: Fetch and return data

        return Ok();
    }
}