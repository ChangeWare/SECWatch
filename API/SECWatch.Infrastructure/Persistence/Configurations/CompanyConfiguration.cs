using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Companies.Models;

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
    }
}