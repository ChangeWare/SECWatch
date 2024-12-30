using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Companies;

namespace SECWatch.Application.Features.Companies;

public interface IMetricMetadataFactory
{
    public MetricMetadata Create(FinancialMetricType metric);
}

public class MetricMetadataFactory : IMetricMetadataFactory
{
    public MetricMetadata Create(FinancialMetricType metric)
    {
        return metric switch
        {
            FinancialMetricType.AccountsPayable => new MetricMetadata
            {
                Label = "Accounts Payable, Current",
                Description =
                    "Carrying value of liabilities incurred and payable to vendors for goods and services received. Represents current portion due within one year or operating cycle.",
                Unit = "USD",
                Category = "Balance Sheet",
                Subcategory = "Current Liabilities"
            },
            FinancialMetricType.Revenue => new MetricMetadata
            {
                Label = "Revenue from Contract with Customer",
                Description = "The amount of revenue recognized from goods or services sold, " +
                              "excluding returns, allowances, and discounts.",
                Unit = "USD",
                Category = "Income Statement",
                Subcategory = "Operating Revenue"
            },
            _ => throw new ArgumentException($"Metadata not defined for metric: {metric}")
        };
    }
}