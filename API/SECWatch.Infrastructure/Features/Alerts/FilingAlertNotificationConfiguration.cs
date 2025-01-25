using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Infrastructure.Features.Alerts;

public class FilingAlertNotificationConfiguration : IEntityTypeConfiguration<FilingAlertNotification>
{
    public void Configure(EntityTypeBuilder<FilingAlertNotification> builder)
    {
        builder.ToTable("FilingAlertNotifications");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.FilingAlertRule)
            .WithMany()
            .HasForeignKey(x => x.FilingAlertRuleId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade); 
        
        builder.Property(x => x.FormType)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Property(x => x.FilingDate)
            .IsRequired();
        
        builder.Property(x => x.IsEmailSent)
            .IsRequired();
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.IsViewed)
            .IsRequired();

        builder.Property(x => x.IsDismissed)
            .IsRequired();

        builder.Property(x => x.EventId)
            .IsRequired();

        builder.Property(x => x.EventType)
            .IsRequired();

        builder.Property(x => x.CompanyCik)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.AccessionNumber)
            .HasMaxLength(20);
    }
}