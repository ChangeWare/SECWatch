import {useMutation, useQuery} from "@tanstack/react-query";
import {notesApi} from "@features/notes/api/notesApi.ts";
import {useMemo} from "react";
import {FilingNote} from "@features/notes/types.ts";
import {toast} from "react-toastify";
import {CreateNoteTagRequest, DeleteNoteTagRequest} from "@features/notes/api/types.ts";
import queryClient from "@common/api/queryClient.ts";

const useUserNotes = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['userNotes'],
        queryFn: () => notesApi.getUserNotes(),
    });

    const notes = useMemo<FilingNote[]>(() => {
        if (!data) {
            return [];
        }

        return data.notes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            reportDate: note.reportDate ? new Date(note.reportDate) : undefined,
            filingDate: new Date(note.filingDate),
        }));

    }, [data]);

    const createNoteTagMutation = useMutation({
        mutationFn: (req: CreateNoteTagRequest) => notesApi.addNoteTag(req),
        onSuccess: (resp) => {
            toast.success('Tag added to note');
            queryClient.invalidateQueries({queryKey: ['userNotes']});
        },
        onError: (error: Error) => {
            toast.error('Failed to create tag');
        }
    });

    const removeNoteTagMutation = useMutation({
        mutationFn: (req: DeleteNoteTagRequest) => notesApi.removeNoteTag(req),
        onSuccess: (resp) => {
            toast.info('Tag removed');
            queryClient.invalidateQueries({queryKey: ['userNotes']});
        },
        onError: (error: Error) => {
            toast.error('Failed to remove tag');
        }
    });

    return {
        notes,
        notesLoading: isLoading,

        addNoteTag: createNoteTagMutation.mutate,
        removeNoteTag: removeNoteTagMutation.mutate,
    }
}

export default useUserNotes;