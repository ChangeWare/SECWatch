using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Infrastructure.Features.Alerts;

public class FilingAlertRuleConfiguration : IEntityTypeConfiguration<FilingAlertRule>
{
    public void Configure(EntityTypeBuilder<FilingAlertRule> builder)
    {
        builder.ToTable("FilingAlertRules");

        builder.HasKey(x => x.Id);
        
        builder.HasOne<Company>()
            .WithMany()
            .HasForeignKey(x => x.CompanyId);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId);
        
        builder.Property(x => x.FormTypes)
            .HasConversion(new ValueConverter<List<string>, string>(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                )
            );
    }
}