using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Companies.Models;

public class Company : AggregateRoot
{
    public string Cik { get; private set; }
    
    public string Ticker { get; private set; }
    
    public string Name { get; private set; }
    
    public string SIC { get; private set; }
    
    public DateTime LastUpdated { get; private set; }
    
    public DateTime? LastKnownFilingDate { get; private set; }
    
    private List<Address> _addresses = [];
    
    public IReadOnlyCollection<Address> Addresses => _addresses.AsReadOnly();
}