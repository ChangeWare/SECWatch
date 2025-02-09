using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Notes.Models;

public class Tag
{
    public Guid Id { get; set; }
    
    public string Label { get; set; }
    public string Color { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public static Tag Create(string label, string color, Guid userId)
    {
        return new Tag()
        {
            Label = label,
            Color = color,
            UserId = userId
        };
    }
}