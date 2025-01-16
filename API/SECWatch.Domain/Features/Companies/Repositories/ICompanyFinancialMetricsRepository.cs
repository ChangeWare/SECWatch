using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyFinancialMetricsRepository
{
    Task<IReadOnlyList<CompanyFinancialMetric>> GetCompanyFinancialMetricsAsync(string cik);
    
    Task<CompanyFinancialMetric> GetCompanyFinancialMetricAsync(string cik, FinancialMetricType metric);
}