using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Infrastructure.Features.Alerts;

public class AlertNotificationConfiguration : IEntityTypeConfiguration<AlertNotification>
{
    public void Configure(EntityTypeBuilder<AlertNotification> builder)
    {
        builder.ToTable("AlertNotifications");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.AlertRule)
            .WithMany()
            .HasForeignKey(x => x.AlertRuleId)
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