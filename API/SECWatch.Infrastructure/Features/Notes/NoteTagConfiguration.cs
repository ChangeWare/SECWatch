using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Features.Notes;

public class NoteTagConfiguration : IEntityTypeConfiguration<NoteTag>
{
    public void Configure(EntityTypeBuilder<NoteTag> builder)
    {
        builder.HasKey(nt => nt.Id);
        
        // Composite unique index
        builder.HasIndex(nt => new { nt.NoteId, nt.TagId })
            .IsUnique();
        
        builder.HasOne(nt => nt.Note)
            .WithMany()
            .HasForeignKey(nt => nt.NoteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(nt => nt.Tag)
            .WithMany()
            .HasForeignKey(nt => nt.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}