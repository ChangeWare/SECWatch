using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Infrastructure.Features.Companies;

public class CompanyUserDashboardPreferencesConfiguration
    : IEntityTypeConfiguration<CompanyUserDashboardPreferences>
{
    public void Configure(EntityTypeBuilder<CompanyUserDashboardPreferences> builder)
    {
        builder.ToTable("CompanyUserDashboardPreferences");
        
        builder.HasKey(dp => dp.Id);
        builder.HasIndex(dp => new { dp.CompanyId, dp.UserId });
        builder.Property(dp => dp.PinnedConcepts)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
    }
    
}