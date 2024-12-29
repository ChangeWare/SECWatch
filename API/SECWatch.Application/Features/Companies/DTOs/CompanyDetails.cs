using SECWatch.Domain.Features.SEC;

namespace SECWatch.Application.Features.Companies.DTOs;

public class CompanyDetails
{
    public string Name { get; set; }
    
    public string Ticker { get; set; }
    
    public string CIK { get; set; }
    
    public Address? MailingAddress { get; set; }
    
    public Address? BusinessAddress { get; set; }
    
    public DateTime LastUpdated { get; set; }
}