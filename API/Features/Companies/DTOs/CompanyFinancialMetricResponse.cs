using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyFinancialMetricResponse
{
    public required CompanyFinancialMetricByPeriod Metric { get; init;  }
}