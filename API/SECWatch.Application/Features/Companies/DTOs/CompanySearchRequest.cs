namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanySearchRequest
{
    public required string SearchTerm { get; init; }
    
    public SearchField SearchField { get; init; } 
}

public enum SearchField
{
    All,
    Name,
    Ticker
}