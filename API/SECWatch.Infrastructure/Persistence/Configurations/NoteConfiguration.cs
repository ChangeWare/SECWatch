using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Persistence.Configurations;

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

        builder.HasOne(n => n.Subject)
            .WithOne()
            .HasPrincipalKey<Note>(n => n.Id)
            .HasForeignKey<NoteSubject>(s => s.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class NoteSubjectConfiguration : IEntityTypeConfiguration<NoteSubject>
{
    public void Configure(EntityTypeBuilder<NoteSubject> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();
        
        builder.Property(s => s.Type)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(s => s.Cik)
            .HasMaxLength(50);

        builder.Property(s => s.AccessionNumber)
            .HasMaxLength(50);
    }
}