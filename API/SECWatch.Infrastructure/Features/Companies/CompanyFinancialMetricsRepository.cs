using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies;

public class CompanyFinancialMetricsRepository(
    IMongoDbContext mongoDbContext,
    ILogger<CompanyFinancialMetricsRepository> logger) : ICompanyFinancialMetricsRepository
{
    public async Task<IReadOnlyList<CompanyFinancialMetric>> GetCompanyFinancialMetricsAsync(string cik)
    {
        var filter = Builders<CompanyFinancialMetric>.Filter.Eq(x => x.Cik, cik);
        var metrics = await mongoDbContext
            .GetCollection<CompanyFinancialMetric>("financial_metrics")
            .Find(filter).ToListAsync();

        return metrics.AsReadOnly();
    }

    public async Task<CompanyFinancialMetric> GetCompanyFinancialMetricAsync(
        string cik, 
        FinancialMetricType metricType)
    {
        var filter = Builders<CompanyFinancialMetric>.Filter.And(
            Builders<CompanyFinancialMetric>.Filter.Eq(x => x.Cik, cik),
            Builders<CompanyFinancialMetric>.Filter.Eq(x => x.MetricType, metricType)
        );

        var metric = await mongoDbContext
            .GetCollection<CompanyFinancialMetric>("financial_metrics")
            .Find(filter).FirstOrDefaultAsync();


        return metric;
    }
}