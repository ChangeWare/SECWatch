using System.Text.Json;
using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Notes.DTOs;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Application.Features.Notes;

public class NoteService(INoteRepository noteRepository, IMapper mapper) : INoteService
{
    public async Task<Result<FilingNote>> CreateFilingNoteAsync(Guid userId, FilingNote filingNote)
    {
        var subject = NoteSubject.CreateFilingNoteSubject(filingNote.AccessionNumber);
        
        var selectionData = JsonSerializer.Serialize(filingNote.SelectionData);
        
        var note = Note.Create(userId, subject, filingNote.Content, filingNote.Color, selectionData);

        var dbResult = await noteRepository.AddAsync(note);
        
        if (dbResult is null)
        {
            return Result.Fail("Failed to create filing note");
        }
        
        return Result.Ok(filingNote with { Id = dbResult.Id });
    }

    public async Task<Result<IReadOnlyList<FilingNote>>> GetFilingNotesAsync(Guid userId, string accessionNumber)
    {
        var notes = await noteRepository.GetUserFilingNotesAsync(userId, accessionNumber);

        var filingNotes = mapper.Map<IReadOnlyList<FilingNote>>(notes);
        
        return Result.Ok(filingNotes);
    }
}