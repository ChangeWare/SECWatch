using FluentResults;
using SECWatch.Application.Features.Companies;
using SECWatch.Application.Features.Companies.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.SEC;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies;

public class CompanyRepository(
    ApplicationDbContext context,
    IMapper mapper) : ICompanyRepository
{
    public async Task<Result<IEnumerable<Company>>> SearchCompaniesAsync(CompanySearchRequest req)
    {
        try 
        {
            var companies = await context.Companies
                .Where(c => c.Name.Contains(req.SearchTerm) || 
                            c.Ticker.Contains(req.SearchTerm))
                .ToListAsync();
                
            return Result.Ok(companies.AsEnumerable());
        }
        catch (Exception ex)
        {
            return Result.Fail(new Error("Unexpected error during company search")
                .CausedBy(ex));
        }
    }

    public async Task<Result<Company?>> GetCompany(string cik)
    {
        try
        {
            var company = await context.Companies
                .FirstOrDefaultAsync(c => c.CIK == cik);
        
            return Result.Ok(company);
        }
        catch (Exception ex)
        {
            return Result.Fail(new Error("Unexpected error during company retrieval")
                .CausedBy(ex));
        }
    }
}