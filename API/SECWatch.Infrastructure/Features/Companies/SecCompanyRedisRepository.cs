using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using StackExchange.Redis;

namespace SECWatch.Infrastructure.Features.Companies;

public interface ISecCompanyRedisRepository
{
    Task<Result<IEnumerable<CompanyInfo>>> SearchCompaniesAsync(CompanySearchRequest req);
    
    Task<CompanyInfo?> GetCompany(string cik);

}

public class SecCompanyRedisRepository(IConnectionMultiplexer redis) : ISecCompanyRedisRepository
{
    private const string CompanyKeyPrefix = "company:";
    
    public async Task<Result<IEnumerable<CompanyInfo>>> SearchCompaniesAsync(CompanySearchRequest req)
    { 
        var db = redis.GetDatabase();
        var server = redis.GetServer(redis.GetEndPoints().First());
        var searchTerm = req.SearchTerm.ToLower();

        // Pattern to use based on search field
        var pattern = req.SearchField switch
        {
            SearchField.Name => $"company:name:{searchTerm}*",
            SearchField.Ticker => $"company:ticker:{searchTerm}*",
            SearchField.All => $"company:*:{searchTerm}*",
            _ => throw new ArgumentOutOfRangeException()
        };
        
        var keys = server.Keys(pattern: pattern);
        var companies = new List<CompanyInfo>();
        
        foreach (var key in keys)
        {
            var cikValue = await db.StringGetAsync(key);
            if (!cikValue.HasValue) continue;
            var cik = cikValue.ToString();

            var hashEntries = await db.HashGetAllAsync($"company:{cik}");
            
            if (hashEntries.Length <= 0) continue;
            
            var company = new CompanyInfo()
            {
                CIK = hashEntries.FirstOrDefault(x => x.Name == "cik").Value!,
                Ticker = hashEntries.FirstOrDefault(x => x.Name == "ticker").Value!,
                Name = hashEntries.FirstOrDefault(x => x.Name == "name").Value!,
                LastUpdated = DateTime.Parse(hashEntries.FirstOrDefault(x => x.Name == "updated_at").Value!)
            };
            
            companies.Add(company);
        }

        return Result.Ok(companies.AsEnumerable());
    }
    
    public async Task<CompanyInfo?> GetCompany(string cik)
    {
        var db = redis.GetDatabase();
        var hashEntries = await db.HashGetAllAsync($"{CompanyKeyPrefix}{cik}");

        if (hashEntries.Length == 0)
            return null;

        return new CompanyInfo()
        {
            CIK = cik,
            Ticker = hashEntries.FirstOrDefault(x => x.Name == "ticker").Value!,
            Name = hashEntries.FirstOrDefault(x => x.Name == "name").Value!,
            LastUpdated = DateTime.Parse(hashEntries.FirstOrDefault(x => x.Name == "updated_at").Value!)
        };
    }
}