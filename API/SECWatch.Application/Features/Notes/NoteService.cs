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
    
    public async Task<Result<ReadOnlyCollection<TagInfo>>> GetAvailableTagsAsync(Guid userId)
    {
        var tags = await noteTagRepository.GetTagsForUserAsync(userId);
        
        var tagDtos = tags.Select(tag => mapper.Map<TagInfo>(tag)).ToList();
        
        return Result.Ok(tagDtos.AsReadOnly());
    }

    public async Task<Result<ReadOnlyCollection<INoteInfo>>> GetUserNotesAsync(Guid userId)
    {
        // 1. Fetch all notes for the user
        var notes = await noteRepository.GetUserNotesAsync(userId);
        
        var filingNotes = notes.Where(n => n.NoteType == NoteTypes.Filing && n.Cik != null);
        var filingCiks = filingNotes.Select(n => n.Cik!).Distinct().ToList();
        
        var noteTagsByNote = await noteTagRepository.GetNoteTagsByNoteAsync(notes.Select(n => n.Id).ToList());
        var uniqueTagIds = noteTagsByNote.Values
            .SelectMany(tags => tags.Select(t => t.TagId))
            .Distinct()
            .ToList();
        var tagLookup = await noteTagRepository.GetTagsByIdsAsync(uniqueTagIds);
        
        var companies = filingCiks.Any() 
            ? await companyRepository.GetCompaniesAsync(filingCiks)
            : new List<Company>();
        var companyLookup = companies.ToDictionary(c => c.Cik);

        // 4. Map notes to DTOs
        var noteDtos = notes.Select<Note, INoteInfo>(note =>
        {
            var noteTags = noteTagsByNote.TryGetValue(note.Id, out var tags) 
                ? tags 
                : Enumerable.Empty<NoteTag>();
                
            var mappedTags = noteTags
                .Select(nt => (NoteTag: nt, Tag: tagLookup.GetValueOrDefault(nt.TagId)))
                .Where(pair => pair.Tag != null)
                .Select(pair => new NoteTagInfo
                {
                    Color = pair.Tag!.Color,
                    Label = pair.Tag.Label,
                    TagId = pair.Tag.Id.ToString(),
                    NoteTagId = pair.NoteTag.Id.ToString()
                })
                .ToList();
            
            if (note.NoteType == NoteTypes.Filing && 
                note.Cik != null && 
                companyLookup.TryGetValue(note.Cik, out var company))
            {
                var companyDto = mapper.Map<CompanyDetails>(company);
                return mapper.Map<FilingNoteInfo>(note) with
                {
                    Company = companyDto,
                    Tags = mappedTags
                };
            }

            return mapper.Map<INoteInfo>(note) with 
            { 
                Tags = mappedTags
            };
        }).ToList();

        return Result.Ok(noteDtos.AsReadOnly());
    }

    public async Task<Result> ApplyNoteTagAsync(Guid userId, Guid noteId, Guid tagId)
    {
        var tag = await noteTagRepository.GetTagByIdAsync(tagId);
        
        if (tag == null)
        {
            return Result.Fail("Tag not found");
        }
        
        var note = await noteRepository.GetNoteByIdAsync(noteId);
        
        if (note == null)
        {
            return Result.Fail("Note not found");
        }
        
        if (note.UserId != userId || tag.UserId != userId)
        {
            return Result.Fail("Unauthorized");
        }
        
        var noteTag = NoteTag.Create(noteId, tagId);
        
        noteTag = await noteTagRepository.AddNoteTagAsync(noteTag);
        
        if (noteTag == null)
        {
            return Result.Fail("Failed to apply tag to note");
        }
        
        return Result.Ok();
    }

    public async Task<Result> AddNoteTagAsync(Guid userId, Guid noteId, TransactTagInfo tagInfo)
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
        
        var tag = Tag.Create(tagInfo.Label, tagInfo.Color, userId);
        
        tag = await noteTagRepository.AddTagAsync(tag);
        
        if (tag == null)
        {
            return Result.Fail("Failed to create tag");
        }
        
        // Apply the tag to the note
        var noteTag = NoteTag.Create(noteId, tag.Id);
        
        noteTag = await noteTagRepository.AddNoteTagAsync(noteTag);
        
        if (noteTag == null)
        {
            return Result.Fail("Failed to apply tag to note");
        }
        
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
        
        // Get and delete all tags associated with the note
        var noteTags = await noteTagRepository.GetNoteTagsAsync(noteId);
        
        foreach (var noteTag in noteTags)
        {
            await noteTagRepository.DeleteAsync(noteTag);
        }
        
        await noteRepository.DeleteAsync(note);
        
        return Result.Ok();
    }
}