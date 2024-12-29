namespace SECWatch.API.Features.Companies.DTOs;

public class AccountsPayableDataPoint
{
    public DateTime EndDate { get; set; }
    public decimal Value { get; set; }
    public int FiscalYear { get; set; }
    public string FiscalPeriod { get; set; }
    public DateTime FilingDate { get; set; }
}
