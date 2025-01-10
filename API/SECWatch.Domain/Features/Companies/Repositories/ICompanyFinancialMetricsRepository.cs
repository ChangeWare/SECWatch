using FluentResults;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies.Repositories;

public interface ICompanyFinancialMetricsRepository
{
    Task<Result<IReadOnlyList<CompanyFinancialMetric>>> GetCompanyFinancialMetricsAsync(string cik);
    
    Task<Result<CompanyFinancialMetric>> GetCompanyFinancialMetricAsync(string cik, FinancialMetricType metric);
}