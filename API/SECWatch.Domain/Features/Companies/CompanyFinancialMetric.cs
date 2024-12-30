namespace SECWatch.Domain.Features.Companies;

public class MetricDataPoint
{
    public DateTime EndDate { get; set; }
    public decimal Value { get; set; }
    public int? FiscalYear { get; set; }
    public string FiscalPeriod { get; set; }
    public string FormType { get; set; }
    public DateTime FilingDate { get; set; }
    public string Frame { get; set; }
    public Dictionary<string, object> Metadata { get; set; }
    public string CurrencyType { get; set; }
}

public class FinancialMetricMetadata
{
    public DateTime FirstReported { get; set; }
    public DateTime LastReported { get; set; }
    public DateTime LastUpdated { get; set; }
    public decimal LastValue { get; set; }
    public List<string> CurrencyTypes { get; set; }
    public int TotalDataPoints { get; set; }
    public Dictionary<string, object> DateRange { get; set; }
}

public class CompanyFinancialMetric
{
    public string Id { get; set; }
    
    public string Cik { get; set; }
    
    public FinancialMetricType MetricType { get; set; }
    
    public List<MetricDataPoint> DataPoints { get; set; }

    public FinancialMetricMetadata Metadata { get; set; }
}