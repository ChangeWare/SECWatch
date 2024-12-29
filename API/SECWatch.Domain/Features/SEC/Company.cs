using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.SEC;

public class Company : AggregateRoot
{
    public string CIK { get; private set; }
    
    public string Ticker { get; private set; }
    
    public string Name { get; private set; }
    
    public string SIC { get; private set; }
    
    public DateTime LastUpdated { get; private set; }
    
    private List<Address> _addresses = [];
    private List<CompanyFinancialMetric> _financialMetrics = [];
    
    public IReadOnlyCollection<Address> Addresses => _addresses.AsReadOnly();
    public IReadOnlyCollection<CompanyFinancialMetric> FinancialMetrics => _financialMetrics.AsReadOnly();
}