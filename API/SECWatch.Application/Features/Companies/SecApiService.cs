using System.IO.Compression;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentResults;
using Microsoft.Extensions.Logging;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Application.Features.Companies;


public class SecApiService(HttpClient httpClient, ILogger<SecApiService> logger) : ISecApiService
{
    private class SecCompany
    {
        [JsonPropertyName("cik_str")]
        public int CikStr { get; set; }

        [JsonPropertyName("ticker")]
        public string Ticker { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }
    }
    
    private const string cookie =
        "ak_bmsc=70328B4BD6C8AB47645A5961D7B257D5~000000000000000000000000000000~YAAQqVkhF6a" +
        "4UbaTAQAAajV8yBoctNydqSHVgEYgPrCe+A9ky/KsuPQ6/tSrBQYD+8PFxM24U8Te+r91r/my8vkxt0/" +
        "PFVZdFbmFBVm9Ivv4ANQhy4v0oXsejtwXA9FIRgzQS/oJzHVPld4c1Tjiptgy/OtbT5Q54nN9CC8JeNBb1Eh5" +
        "pL6JgYRlrWNZuU8ftVIKt08Ai2V21v4judFOQ0gW8r/F7m0MnXSeRbqVDcWlw3fdVDeaCsRBdPCF4Rreptam" +
        "d6iwDAPFY0F+8ng3bM+800pDPUDmaK9mCe3xHqP29MBpyg5wx7XdFIuRJVxZ/VW8JjF95vrf02StRSirgk" +
        "JUByFCG3qYNtY16LNSlI04OL22WfBN/5Y5PmgFhQdF4gttebnZVaKfkcCfJ1VHK6Xv8dDE; " +
        "bm_sv=3749A7BF70E3DE862CD9AA52104D7663~YAAQqVkhF82uUbaTAQAAL8V7yBpwNB3RL2brG+2" +
        "E9XbXskh5I3HtohetZyekMTnbzm6naJPEIIjvEbvCYuWz9MFHbe5KBBHf2HEqWvXIy9hsjmbr1+e" +
        "2SbJLGHIOwi/IPdnb4KN1wULAj7qZsHyJhiA4lUkgRWoAOtxfvGta8rHWZrVatXhjpdwQtv2F0/kptM" +
        "Gp9Zx2DoULqEiLtA3djs5s4aCKyORhV3w0M7/RAfypbAri/fVaeo3qHnms~1";
    
    public async Task<Result<IEnumerable<CompanySearchResponse>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.sec.gov/files/company_tickers.json");
            request.Headers.Add("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15");
            request.Headers.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            request.Headers.Add("Accept-Encoding", "gzip, deflate, br");
            request.Headers.Add("Accept-Language", "en-US,en;q=0.9");
            request.Headers.Add("Referer", "https://www.sec.gov/");
            request.Headers.Add("Cookie", cookie);
            
            
            var response = await httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();
            
            // print the content of the response just to see what it looks like
            var contentStream = await response.Content.ReadAsStreamAsync();
            await using var decompressedStream = new GZipStream(contentStream, CompressionMode.Decompress);
            using var reader = new StreamReader(decompressedStream);
            var contentString = await reader.ReadToEndAsync();
            
            var content = JsonSerializer.Deserialize<Dictionary<string, SecCompany>>(contentString);
            
            if (content == null)
            {
                return Result.Fail($"Error parsing response from SEC API");
            }
            
            
            var companies = content.Select(entry =>
                    new CompanySearchResponse()
                    {
                        CIK = entry.Value.CikStr.ToString().PadLeft(10, '0'),
                        Name = entry.Value.Title,
                        Ticker = entry.Value.Ticker,
                        //SicDescription = "" // Would need additional API call for SIC info
                    })
                .Where(c => req.SearchField switch
                {
                    SearchField.Name => c.Name.Contains(req.SearchTerm, StringComparison.OrdinalIgnoreCase),
                    SearchField.Ticker => c.Ticker.Contains(req.SearchTerm, StringComparison.OrdinalIgnoreCase),
                    _ => c.Name.Contains(req.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                         c.Ticker.Contains(req.SearchTerm, StringComparison.OrdinalIgnoreCase)
                }).ToList().AsEnumerable();
            
            return Result.Ok(companies);
        } 
        catch (Exception e)
        {
            logger.LogError(e, "Error searching for SEC companies with request: {@Request}", req);
            throw;
        }
    }
}