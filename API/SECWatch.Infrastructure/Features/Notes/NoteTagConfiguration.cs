using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Features.Notes;

public class NoteTagConfiguration: IEntityTypeConfiguration<NoteTag>
{
    public void Configure(EntityTypeBuilder<NoteTag> builder)
    {
        builder.HasKey(nt => nt.Id);
        
        builder.HasIndex( nt => nt.NoteId);

        builder.HasOne(nt => nt.Note)
            .WithMany()
            .HasForeignKey(nt => nt.NoteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(nt => nt.Label)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(nt => nt.Color)
            .IsRequired()
            .HasMaxLength(7);
    }
}