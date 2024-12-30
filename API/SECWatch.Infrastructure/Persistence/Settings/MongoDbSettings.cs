namespace SECWatch.Infrastructure.Persistence.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public string FinancialMetricsCollection { get; set; }
}