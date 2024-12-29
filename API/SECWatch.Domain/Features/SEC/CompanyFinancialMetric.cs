using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.SEC;

/// <summary>
/// Tracks which metrics exist for a company, the last reported value, and when it was last updated.
/// Also tracks the first and last reported dates for the metric.
/// </summary>
public class CompanyFinancialMetric : IEntity
{
    public Guid Id { get; init; }
    
    public DateTime FirstReported { get; init; }
    public DateTime LastReported { get; init; }
    public DateTime LastUpdated { get; init; }
    
    public FinancialMetric Metric { get; init; }
    
    public decimal LastValue { get; init; }
    
    public required Company Company { get; init; }
    public required string CompanyCIK { get; init; }
}