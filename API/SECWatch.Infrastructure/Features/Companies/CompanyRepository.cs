using FluentResults;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Queries;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies;

public class CompanyRepository(
    ApplicationDbContext context,
    IMongoDbContext mongoDbContext,
    IMapper mapper) : ICompanyRepository
{
    public async Task<Result<IReadOnlyList<Company>>> SearchCompaniesAsync(CompanySearchQuery query)
    {
        try 
        {
            var companies = await context.Companies
                .Where(c => c.Name.Contains(query.SearchTerm) || 
                            c.Ticker.Contains(query.SearchTerm))
                .ToListAsync();
                
            return Result.Ok<IReadOnlyList<Company>>(companies.AsReadOnly());
        }
        catch (Exception ex)
        {
            return Result.Fail(new Error("Unexpected error during company search")
                .CausedBy(ex));
        }
    }

    public async Task<Result<Company?>> GetCompanyAsync(string cik)
    {
        try
        {
            var company = await context.Companies
                .FirstOrDefaultAsync(c => c.Cik == cik);
        
            return Result.Ok(company);
        }
        catch (Exception ex)
        {
            return Result.Fail(new Error("Unexpected error during company retrieval")
                .CausedBy(ex));
        }
    }

    public async Task<Result<CompanyFilingHistory>> GetCompanyFilingsHistoryAsync(string cik)
    {
        try
        {
            var filings = await mongoDbContext
                .GetCollection<CompanyFilingHistory>("filing_history")
                .Find(x => x.Cik == cik)
                .FirstOrDefaultAsync();
            
            return Result.Ok(filings);
        }
        catch (Exception ex)
        {
            return Result.Fail(new Error("Unexpected error during company filings history retrieval")
                .CausedBy(ex));
        }
        
    }
}