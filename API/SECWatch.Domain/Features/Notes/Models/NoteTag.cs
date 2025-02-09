using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Notes.Models;

public class NoteTag : AggregateRoot
{
    public Guid NoteId { get; set; }
    public Note Note { get; set; }

    public Guid TagId { get; set; }
    public Tag Tag { get; set; }
    
    public static NoteTag Create(Guid noteId, Guid tagId)
    {
        return new NoteTag()
        {
            NoteId = noteId,
            TagId = tagId
        };
    }
}