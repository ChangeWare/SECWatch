namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanyFilingHistoryDto
{
    public string Cik { get; init; }
    
    public DateTime LastUpdated { get; init; }
    
    public IReadOnlyList<CompanyFilingDto> Filings { get; init; }
}