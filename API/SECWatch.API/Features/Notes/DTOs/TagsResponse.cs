using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record TagsResponse
{
    public required IReadOnlyList<TagInfo> Tags { get; init; }
}