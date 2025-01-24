using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    [ProducesResponseType(typeof(FilingNoteResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("filing-notes/{accessionNumber}")]
    public async Task<ActionResult<FilingNoteResponse>> GetFilingNotes(string accessionNumber)
    {
        var userId = User.GetUserId();
        
        var result = await noteService.GetFilingNotesAsync(userId, accessionNumber);
        
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }

        var response = new FilingNoteResponse()
        {
            Notes = result.Value,
            Count = result.Value.Count
        };

        return Ok(response);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(CreatedNoteResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Route("filing-notes/{accessionNumber}/create")]
    public async Task<ActionResult<CreatedNoteResponse>> CreateFilingNote(CreateFilingNoteRequest request)
    {
        var userId = User.GetUserId();
        
        var filingNote = mapper.Map<FilingNote>(request);
        
        var result = await noteService.CreateFilingNoteAsync(userId, filingNote);
        
        if (result.IsFailed)
        {
            return BadRequest(result.Errors);
        }

        var response = new CreatedNoteResponse()
        {
            Note = result.Value
        };

        return Ok(response);
    }
}