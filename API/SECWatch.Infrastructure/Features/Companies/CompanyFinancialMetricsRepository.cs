using FluentResults;
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
    public async Task<Result<IEnumerable<CompanyFinancialMetric>>> GetCompanyFinancialMetricsAsync(string cik)
    {
        try
        {
            var filter = Builders<CompanyFinancialMetric>.Filter.Eq(x => x.Cik, cik);
            var metrics = await mongoDbContext
                .GetCollection<CompanyFinancialMetric>("financial_metrics")
                .Find(filter).ToListAsync();
            
            return Result.Ok<IEnumerable<CompanyFinancialMetric>>(metrics);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving financial metrics for CIK: {Cik}", cik);
            return Result.Fail<IEnumerable<CompanyFinancialMetric>>(
                "Failed to retrieve financial metrics");
        }
    }

    public async Task<Result<CompanyFinancialMetric>> GetCompanyFinancialMetricAsync(
        string cik, 
        FinancialMetricType metricType)
    {
        try
        {
            var filter = Builders<CompanyFinancialMetric>.Filter.And(
                Builders<CompanyFinancialMetric>.Filter.Eq(x => x.Cik, cik),
                Builders<CompanyFinancialMetric>.Filter.Eq(x => x.MetricType, metricType)
            );

            var metric = await mongoDbContext
                .GetCollection<CompanyFinancialMetric>("financial_metrics")
                .Find(filter).FirstOrDefaultAsync();

            if (metric == null)
                return Result.Fail<CompanyFinancialMetric>(
                    $"No financial metric found for CIK: {cik}, Metric: {metric}");

            return Result.Ok(metric);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, 
                "Error retrieving financial metric for CIK: {Cik}, Metric: {Metric}",
                cik, metricType.ToString());
            return Result.Fail("Failed to retrieve financial metric");
        }
    }
}