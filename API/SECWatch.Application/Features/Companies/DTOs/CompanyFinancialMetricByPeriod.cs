using SECWatch.Domain.Features.Companies;

namespace SECWatch.Application.Features.Companies.DTOs;

public record CompanyFinancialMetricByPeriod
{
    public string Cik { get; init; }
    
    public FinancialMetricType MetricType { get; init; }
    
    public decimal LastValue { get; init; }
    
    public DateTime LastUpdated { get; init; }
    
    public DateTime LastReported { get; init; }
    
    public IReadOnlyList<MetricDataPoint> DataPoints { get; init; }
    
    public FinancialMetricPeriodType PeriodType { get; init; }
}