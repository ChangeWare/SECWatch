using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Infrastructure.Features.Alerts;

public class AlertRuleConfiguration : IEntityTypeConfiguration<AlertRule>
{
    public void Configure(EntityTypeBuilder<AlertRule> builder)
    {
        builder.ToTable("AlertRules");

        builder.HasKey(x => x.Id);
        
        builder.HasOne(x => x.Company)
            .WithMany()
            .HasForeignKey(x => x.CompanyId);
        
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Property("_formTypes")
            .HasConversion(new ValueConverter<List<string>, string>(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                )
            );

        builder.Property(x => x.LastTriggeredAt)
            .IsRequired(false);
        
        builder.HasIndex(x => new { x.Type, x.UserId });
    }
}