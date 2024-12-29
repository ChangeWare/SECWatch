using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Infrastructure.Persistence.Configurations;

public class CompanyFinancialMetricConfiguration : IEntityTypeConfiguration<CompanyFinancialMetric>
{
    public void Configure(EntityTypeBuilder<CompanyFinancialMetric> builder)
    {
        builder.ToTable("CompanyFinancialMetrics");
        
        builder.Property(x => x.Metric)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();
    }
}