using System.Collections.ObjectModel;
using System.Text.Json;
using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Application.Features.Notes.DTOs;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Application.Features.Notes;

public class NoteService(
    INoteRepository noteRepository, 
    ICompanyRepository companyRepository,
    INoteTagRepository noteTagRepository,
    IMapper mapper) : INoteService
{
    public async Task<Result<FilingNoteInfo>> CreateFilingNoteAsync(Guid userId, TransactFilingNoteInfo filingNoteInfo)
    {
        var selectionData = JsonSerializer.Serialize(filingNoteInfo.SelectionData);

        var note = Note.CreateFilingNote(
            userId,
            filingNoteInfo.AccessionNumber,
            filingNoteInfo.Cik,
            filingNoteInfo.Form,
            filingNoteInfo.FilingDate,
            filingNoteInfo.ReportDate,
            filingNoteInfo.Content,
            filingNoteInfo.Color,
            selectionData
        );

        var dbResult = await noteRepository.AddAsync(note);
        
        if (dbResult == null)
        {
            return Result.Fail("Failed to create note");
        }
        
        var noteDto = mapper.Map<FilingNoteInfo>(dbResult);
        
        return Result.Ok(noteDto);
    }

    public async Task<Result<IReadOnlyList<FilingNoteInfo>>> GetFilingNotesAsync(Guid userId, string accessionNumber)
    {
        var notes = await noteRepository.GetUserFilingNotesAsync(userId, accessionNumber);

        var filingNotes = mapper.Map<IReadOnlyList<FilingNoteInfo>>(notes);
        
        return Result.Ok(filingNotes);
    }

    public async Task<Result<ReadOnlyCollection<INoteInfo>>> GetUserNotesAsync(Guid userId)
    {
        var notes = await noteRepository.GetUserNotesAsync(userId);
        var filingNotesCiks = notes
            .Where(n => n.NoteType == NoteTypes.Filing && n.Cik != null)
            .Select(n => n.Cik!)
            .Distinct()
            .ToList();
        
        var filingNoteIds = notes
            .Where(n => n.NoteType == NoteTypes.Filing)
            .Select(n => n.Id)
            .ToList();

        var noteTagsByNote = await noteTagRepository.GetNoteTagsByNoteAsync(filingNoteIds);
        
        var companies = filingNotesCiks.Any() 
            ? await companyRepository.GetCompaniesAsync(filingNotesCiks)
            : new List<Company>();

        var companyLookup = companies.ToDictionary(c => c.Cik);

        var noteDtos = notes.Select<Note, INoteInfo>(n =>
        {
            if (n.NoteType == NoteTypes.Filing && n.Cik != null && companyLookup.TryGetValue(n.Cik, out var company))
            {
                var companyDto = mapper.Map<CompanyDetails>(company);
                return mapper.Map<FilingNoteInfo>(n) with
                {
                    Company = companyDto,
                    Tags = noteTagsByNote.TryGetValue(n.Id, out var t)
                        ? mapper.Map<IReadOnlyList<NoteTagInfo>>(t)
                        : new List<NoteTagInfo>()
                };
            }

            return mapper.Map<INoteInfo>(n) with
            {
                Tags = noteTagsByNote.TryGetValue(n.Id, out var tags)
                    ? mapper.Map<IReadOnlyList<NoteTagInfo>>(tags)
                    : new List<NoteTagInfo>()
            };
        }).ToList();

        return Result.Ok(noteDtos.AsReadOnly());
    }

    public async Task<Result> AddNoteTagAsync(Guid userId, Guid noteId, TransactNoteTagInfo tagInfo)
    {
        var note = await noteRepository.GetNoteByIdAsync(noteId);
        
        if (note == null)
        {
            return Result.Fail("Note not found");
        }
        
        if (note.UserId != userId)
        {
            return Result.Fail("Unauthorized");
        }
        
        var tag = NoteTag.Create(noteId, tagInfo.Label, tagInfo.Color);
        
        await noteTagRepository.AddAsync(tag);
        
        return Result.Ok();
    }

    public async Task<Result> RemoveNoteTagAsync(Guid userId, Guid noteId, Guid tagId)
    {
        var note = await noteRepository.GetNoteByIdAsync(noteId);
        
        if (note == null)
        {
            return Result.Fail("Note not found");
        }
        
        if (note.UserId != userId)
        {
            return Result.Fail("Unauthorized");
        }
        
        var tag = await noteTagRepository.GetNoteTagByIdAsync(tagId);
        
        if (tag == null)
        {
            return Result.Fail("Tag not found");
        }
        
        await noteTagRepository.DeleteAsync(tag);
        
        return Result.Ok();
    }

    public async Task<Result> DeleteNoteAsync(Guid userId, Guid noteId)
    {
        var note = await noteRepository.GetNoteByIdAsync(noteId);
        
        if (note == null)
        {
            return Result.Fail("Note not found");
        }
        
        if (note.UserId != userId)
        {
            return Result.Fail("Unauthorized");
        }
        
        await noteRepository.DeleteAsync(note);
        
        return Result.Ok();
    }
}