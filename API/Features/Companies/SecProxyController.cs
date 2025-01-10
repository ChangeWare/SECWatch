using Microsoft.AspNetCore.Mvc;

namespace SECWatch.API.Features.Companies;

[ApiController]
[Route("api/proxy")]
public class SecProxyController(
    IHttpClientFactory clientFactory,
    ILogger<SecProxyController> logger)
    : ControllerBase
{
    private const string SEC_BASE_URL = "https://www.sec.gov";

    [HttpGet("filing/{*path}")]
    public async Task<IActionResult> ProxyFilingRequest(string path)
    {
        try
        {
            var client = clientFactory.CreateClient();
            client.DefaultRequestHeaders.UserAgent.ParseAdd(
                "SECWatch/1.0 (+mailto:support@changeware.net)"
            );

            var response = await client.GetAsync($"{SEC_BASE_URL}/Archives/{path}");
            
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("SEC request failed: {StatusCode}", response.StatusCode);
                return StatusCode((int)response.StatusCode);
            }

            var content = await response.Content.ReadAsByteArrayAsync();
            return File(content, response.Content.Headers.ContentType?.ToString() ?? string.Empty);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error proxying SEC request");
            return StatusCode(500, "Error retrieving SEC filing");
        }
    }
}