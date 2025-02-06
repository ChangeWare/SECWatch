namespace SECWatch.Application.Features.Companies.DTOs;

public class CompanyFilingDto
{
    public string Form { get; set; }
    
    public string AccessionNumber { get; set; }
    
    public DateTime FilingDate { get; set; }
    
    public DateTime? ReportDate { get; set; }
    
    public string Items { get; set; }
    
    public string PrimaryDocument { get; set; }
}