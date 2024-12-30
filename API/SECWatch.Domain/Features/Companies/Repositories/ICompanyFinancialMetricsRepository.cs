using FluentResults;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyFinancialMetricsRepository
{
    Task<Result<IEnumerable<CompanyFinancialMetric>>> GetCompanyFinancialMetricsAsync(string cik);
    
    Task<Result<CompanyFinancialMetric>> GetCompanyFinancialMetricAsync(string cik, FinancialMetricType metric, FinancialMetricPeriodType period);
}