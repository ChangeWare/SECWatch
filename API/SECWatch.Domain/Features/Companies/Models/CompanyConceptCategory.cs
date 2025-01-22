namespace SECWatch.Domain.Features.Companies.Models;

public record CompanyConceptCategory
{
    public string Description { get; set; }
    
    public string Category { get; set; }

    public bool IsCurrencyData { get; set; } = true;
}