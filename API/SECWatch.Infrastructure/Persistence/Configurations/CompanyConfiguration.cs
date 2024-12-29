using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.SEC;

namespace SECWatch.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasAlternateKey(c => c.CIK);

        builder.HasMany<Address>(c => c.Addresses)
            .WithOne(a => a.Company)
            .HasForeignKey(a => a.CompanyId);
        
        builder.HasMany<CompanyFinancialMetric>(c => c.FinancialMetrics)
            .WithOne(fm => fm.Company)
            .HasForeignKey(fm => fm.CompanyCIK)
            .HasPrincipalKey(c => c.CIK);
    }
}