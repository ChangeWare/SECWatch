using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Notes.Models;

public class Note : AggregateRoot
{
    public string Content { get; private set; }
    
    public string SelectionData { get; private set; }
    
    public Guid UserId { get; private set; }
    
    public string Color { get; private set; }
    
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    
    public NoteSubject Subject { get; private init; }
    
    private Note()
    {
    }

    public static Note Create(Guid userId, NoteSubject subject, 
        string content, string color, string selectionData)
    {
        var note = new Note()
        {
            UserId = userId,
            Subject = subject,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            Color = color,
            SelectionData = selectionData
        };

        return note;
    }
}