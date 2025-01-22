namespace SECWatch.Domain.Features.Companies.Models;

public class ConceptDataPoint
{
    public DateTime? StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Value { get; set; }
    public int? FiscalYear { get; set; }
    public string FiscalPeriod { get; set; }
    public string FormType { get; set; }
    public DateTime FilingDate { get; set; }
    public string Frame { get; set; }
    public string AccessionNumber { get; set; }
    public string UnitType { get; set; }
}

public class CompanyConceptMetadata
{
    public DateTime FirstReported { get; set; }
    public DateTime LastReported { get; set; }
    public DateTime LastUpdated { get; set; }
    public decimal LastValue { get; set; }
    public List<string> UnitTypes { get; set; }
    public int TotalDataPoints { get; set; }
    public Dictionary<string, object> DateRange { get; set; }
}

public class CompanyConceptsMetadata
{  
    public string Cik { get; set; }
    public IReadOnlyList<string> ConceptTypes { get; set; }
    public int TotalConcepts { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class CompanyConcept
{
    public string Id { get; set; }
    
    public string Cik { get; set; }
    
    public string ConceptType { get; set; }
    
    public List<ConceptDataPoint> DataPoints { get; set; }

    public CompanyConceptMetadata Metadata { get; set; }
    
    public bool OnlyContainsYearEndData() => DataPoints.All(x => x.FiscalPeriod == FinancialPeriod.FY);
}