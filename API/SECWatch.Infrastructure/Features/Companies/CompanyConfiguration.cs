using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Infrastructure.Features.Companies;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);

        builder.HasAlternateKey(c => c.Cik);
        
        builder.Property(c => c.Name)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasMany<Address>(c => c.Addresses)
            .WithOne(a => a.Company)
            .HasForeignKey(a => a.CompanyId);
        
        builder.Property(c => c.EIN)
            .HasMaxLength(12);

        builder.Property(c => c.Ticker)
            .HasMaxLength(10);

        builder.Property(c => c.SIC)
            .HasMaxLength(5);

        builder.Property(c => c.EntityType)
            .HasMaxLength(50);

        builder.Property(c => c.Website)
            .HasMaxLength(200);

        builder.Property(c => c.FiscalYearEnd)
            .HasMaxLength(10);
        
        builder.Property(c => c.StateOfIncorporation)
            .HasMaxLength(20);

        builder.Property(c => c.PhoneNumber)
            .HasMaxLength(20);
        
    }
}