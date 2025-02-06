using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Features.Notes;

public class NoteConfiguration : IEntityTypeConfiguration<Note>
{
    public void Configure(EntityTypeBuilder<Note> builder)
    {
        builder.HasKey(n => n.Id);
        
        builder.Property(n => n.UserId)
            .IsRequired();

        builder.Property(n => n.Content)
            .IsRequired()
            .HasMaxLength(10000);

        builder.Property(n => n.SelectionData)
            .HasColumnType("nvarchar(max)");
    }
}