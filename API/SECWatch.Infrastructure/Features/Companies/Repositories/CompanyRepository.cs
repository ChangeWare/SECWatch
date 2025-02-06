using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Queries;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies.Repositories;

public class CompanyRepository(
    ApplicationDbContext context,
    IMongoDbContext mongoDbContext) : ICompanyRepository
{
    public async Task<IReadOnlyList<Company>> SearchCompaniesAsync(CompanySearchQuery query)
    {
        var companies = await context.Companies
            .Where(c => c.Ticker != null && (c.Name.Contains(query.SearchTerm) || 
                                             c.Ticker.Contains(query.SearchTerm)))
            .ToListAsync();

        return companies.AsReadOnly();
    }

    public async Task<Company?> GetCompanyAsync(string cik)
    {
        var company = await context.Companies
            .FirstOrDefaultAsync(c => c.Cik == cik);

        return company;
    }

    public async Task<CompanyFilingHistory> GetCompanyFilingsHistoryAsync(string cik)
    {
        var filings = await mongoDbContext
            .GetCollection<CompanyFilingHistory>("filing_history")
            .Find(x => x.Cik == cik)
            .FirstOrDefaultAsync();

        return filings;
    }
    
    public async Task<CompanyFiling?> GetCompanyMostRecentFilingAsync(string cik)
    {
        var filingHistory = await mongoDbContext
            .GetCollection<CompanyFilingHistory>("filing_history")
            .Find(x => x.Cik == cik)
            .Project<CompanyFilingHistory>(Builders<CompanyFilingHistory>.Projection.Include(x => x.MostRecentFiling))
            .FirstOrDefaultAsync();
        
        return filingHistory?.MostRecentFiling;
    }

    public async Task<IReadOnlyList<Company>> GetCompaniesAsync(IEnumerable<string> ciks)
    {
        var companies = await context.Companies
            .Where(c => ciks.Contains(c.Cik))
            .ToListAsync();

        return companies.AsReadOnly();
    }

    /// <summary>
    /// Fetches the most recent filings for the specified ciks
    /// </summary>
    /// <param name="ciks">ciks of the companies for which to retrieve filings</param>
    /// <returns>Dictionary with key: cik, value: most recent filing for company with cik</returns>
    public async Task<Dictionary<string, CompanyFiling?>> GetCompaniesMostRecentFilingsAsync(IEnumerable<string> ciks)
    {
        var filter = Builders<CompanyFilingHistory>.Filter.In(x => x.Cik, ciks);
    
        var filings = await mongoDbContext
            .GetCollection<CompanyFilingHistory>("filing_history")
            .Find(filter)
            .Project<CompanyFilingHistory>(Builders<CompanyFilingHistory>.Projection
                .Include(x => x.Cik)
                .Include(x => x.MostRecentFiling))
            .ToListAsync();

        return filings.ToDictionary(
            f => f.Cik,
            f => f.MostRecentFiling
        );
    }
}