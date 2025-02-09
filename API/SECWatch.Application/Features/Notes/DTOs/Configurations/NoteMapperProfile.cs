using AutoMapper;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Application.Features.Notes.DTOs.Configurations;

public class SelectionDataValueResolver(ISelectionDataResolver resolver)
    : IValueResolver<Note, FilingNoteInfo, FilingNoteSelectionData>
{
    public FilingNoteSelectionData Resolve(Note source, FilingNoteInfo destination, FilingNoteSelectionData destMember, ResolutionContext context)
    {
        return resolver.Resolve<FilingNoteSelectionData>(source);
    }
}

public class NoteMapperProfile : Profile
{
    public NoteMapperProfile()
    {
        CreateMap<TransactFilingNoteInfo, FilingNoteInfo>();

        CreateMap<Note, INoteInfo>()
            .Include<Note, FilingNoteInfo>();
        
        CreateMap<Note, FilingNoteInfo>()
            .ForMember(dest => dest.SelectionData,
                opt => opt.MapFrom<SelectionDataValueResolver>());
        
        CreateMap<Tag, TagInfo>();
    }
}