using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Common;
using SECWatch.API.Features.Alerts.DTOs;
using SECWatch.API.Features.Authentication;
using SECWatch.API.Features.Notes.DTOs;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Notes;
using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes;

[ApiController]
[Route("api/notes")]
[RequireAuth]
public class NoteController(INoteService noteService, IMapper mapper) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(NotesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("filing-notes/{accessionNumber}")]
    public async Task<ActionResult<NotesResponse>> GetFilingNotes(string accessionNumber)
    {
        var userId = User.GetUserId();

        var result = await noteService.GetFilingNotesAsync(userId, accessionNumber);

        return result.ToActionResponse(notes => new NotesResponse()
        {
            Notes = notes,
            Count = notes.Count
        });
    }

    [HttpPost]
    [ProducesResponseType(typeof(CreateNoteResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("create")]
    public async Task<ActionResult<CreateNoteResponse>> CreateNote([FromBody]CreateNoteRequest request)
    {
        var userId = User.GetUserId();
        
        var result = request.Note switch
        {
            TransactFilingNoteInfo noteData => await noteService.CreateFilingNoteAsync(userId, noteData),
            _ => throw new ArgumentException($"Unsupported alert type: {request.Note.GetType()}")
        };

        return result.ToActionResponse(note => new CreateNoteResponse
        {
            Note = note
        });
    }

    [HttpGet]
    [ProducesResponseType(typeof(NotesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NotesResponse>> GetNotes()
    {
        var userId = User.GetUserId();

        var result = await noteService.GetUserNotesAsync(userId);

        return result.ToActionResponse(notes => new NotesResponse
        { 
            Notes = notes,
            Count = notes.Count
        });
    }
    
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("{noteId}")]
    public async Task<ActionResult> DeleteNote(Guid noteId)
    {
        var userId = User.GetUserId();

        var result = await noteService.DeleteNoteAsync(userId, noteId);

        return result.ToActionResult();
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("{noteId}/tags")]
    public async Task<ActionResult> AddTag(Guid noteId, [FromBody]CreateNoteTagRequest request)
    {
        var userId = User.GetUserId();

        var result = await noteService.AddNoteTagAsync(userId, noteId, request.Tag);

        return result.ToActionResult();
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(TagsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("tags")]
    public async Task<ActionResult<TagsResponse>> GetTags()
    {
        var userId = User.GetUserId();
        
        var result = await noteService.GetAvailableTagsAsync(userId);

        return result.ToActionResponse(tags => new TagsResponse
        {
            Tags = tags
        });
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("tags/{tagId}/apply/{noteId}")]
    public async Task<ActionResult> AddTag(Guid noteId, Guid tagId)
    {
        var userId = User.GetUserId();

        var result = await noteService.ApplyNoteTagAsync(userId, noteId, tagId);

        return result.ToActionResult();
    }
    
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("{noteId}/tags/{tagId}")]
    public async Task<ActionResult> DeleteTag(Guid noteId, Guid tagId)
    {
        var userId = User.GetUserId();

        var result = await noteService.RemoveNoteTagAsync(userId, noteId, tagId);

        return result.ToActionResult();
    }
}