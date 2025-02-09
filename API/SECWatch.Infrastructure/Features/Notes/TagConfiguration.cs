using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Features.Notes;

public class TagConfiguration: IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Label)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.Color)
            .IsRequired()
            .HasMaxLength(10);

        builder.HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}