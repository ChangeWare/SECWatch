namespace SECWatch.Domain.Features.Notes.Models;

public class NoteTag
{
    public Guid Id { get; set; }
    
    public Guid NoteId { get; set; }
    public Note Note { get; set; }
    
    public string Label { get; set; }
    public string Color { get; set; }
    
    public static NoteTag Create(Guid noteId, string label, string color)
    {
        return new NoteTag()
        {
            NoteId = noteId,
            Label = label,
            Color = color
        };
    }
}