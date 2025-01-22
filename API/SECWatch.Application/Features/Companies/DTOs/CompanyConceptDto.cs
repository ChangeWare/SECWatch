using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanyConceptDto
{
    public string Cik { get; init; }
    
    public string ConceptType { get; init; }
    
    public decimal LastValue { get; init; }
    
    public DateTime LastUpdated { get; init; }
    
    public DateTime LastReported { get; init; }
    
    public string Category { get; init; }
    
    public string Description { get; init; }
    
    public bool IsCurrencyData { get; init; }
    
    public required IReadOnlyList<ConceptDataPoint> DataPoints { get; init; }
    
    public required IReadOnlyList<string> CurrencyTypes { get; init; }
}