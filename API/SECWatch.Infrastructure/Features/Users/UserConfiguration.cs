using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Users.Models;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.Infrastructure.Features.Users;

public class UserConfiguration() : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();
        
        builder.Property<string>("EmailVerificationToken")
            .HasMaxLength(1024)
            .HasColumnName("EmailVerificationToken");

        builder.Property(u => u.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .IsRequired();
        

        builder.Property<Dictionary<string, UserPreference>>("_preferences")
            .HasColumnName("Preferences")
            .HasColumnType("nvarchar(max)")
            .HasConversion(new UserPreferencesValueConverter())
            .IsRequired(true);

    }
    
}