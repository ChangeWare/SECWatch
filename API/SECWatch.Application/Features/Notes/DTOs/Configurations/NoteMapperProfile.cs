using AutoMapper;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Application.Features.Notes.DTOs.Configurations;

public class SelectionDataValueResolver(ISelectionDataResolver resolver)
    : IValueResolver<Note, FilingNote, FilingNoteSelectionData>
{
    public FilingNoteSelectionData Resolve(Note source, FilingNote destination, FilingNoteSelectionData destMember, ResolutionContext context)
    {
        return resolver.Resolve<FilingNoteSelectionData>(source);
    }
}

public class NoteMapperProfile : Profile
{
    public NoteMapperProfile()
    {
        CreateMap<CreateFilingNoteRequest, FilingNote>();
        CreateMap<Note, FilingNote>()
            .ForMember(dest => dest.SelectionData, 
                opt => opt.MapFrom<SelectionDataValueResolver>());
    }
}