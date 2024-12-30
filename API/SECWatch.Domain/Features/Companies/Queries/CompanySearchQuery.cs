namespace SECWatch.Domain.Features.Companies.Queries;

public enum SearchField
{
    All,
    Name,
    Ticker
}

public class CompanySearchQuery
{
    public required string SearchTerm { get; init; }
    
    public SearchField SearchField { get; init; } 
}