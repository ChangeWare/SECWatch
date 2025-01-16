namespace SECWatch.Application.Features.Companies.DTOs;

public class TrackedCompanyDetails
{
    public DateTime DateAdded { get; set; }
    
    public DateTime LastEvent { get; set; }
    
    public int NewFilings { get; set; }
    
    public CompanyDetails Company { get; set; }
    
    public CompanyFilingDto? MostRecentFiling { get; set; }
}