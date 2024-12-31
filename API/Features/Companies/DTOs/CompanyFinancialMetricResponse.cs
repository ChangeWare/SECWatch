using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyFinancialMetricResponse
{
    public required CompanyFinancialMetricDto Metric { get; init;  }
}