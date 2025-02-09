import {useMutation, useQuery} from "@tanstack/react-query";
import {notesApi} from "@features/notes/api/notesApi.ts";
import {useMemo} from "react";
import {FilingNote} from "@features/notes/types.ts";
import {toast} from "react-toastify";
import {ApplyNoteTagRequest, CreateNoteTagRequest, DeleteNoteTagRequest} from "@features/notes/api/types.ts";
import queryClient from "@common/api/queryClient.ts";
import {useAuth} from "@features/auth";

const useUserNotes = () => {
    const { isAuthenticated } = useAuth();

    const { data: notesData, isLoading } = useQuery({
        queryKey: ['userNotes'],
        queryFn: () => notesApi.getUserNotes(),
        enabled: isAuthenticated,
    });

    const { data: tagData } = useQuery({
        queryKey: ['availableTags'],
        queryFn: () => notesApi.getAvailableTags(),
        enabled: isAuthenticated,
    });

    const notes = useMemo<FilingNote[]>(() => {
        if (!notesData) {
            return [];
        }

        return notesData.notes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            reportDate: note.reportDate ? new Date(note.reportDate) : undefined,
            filingDate: new Date(note.filingDate),
        }));

    }, [notesData]);

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

    const applyNoteTagMutation = useMutation({
        mutationFn: (req: ApplyNoteTagRequest) => notesApi.applyNoteTag(req),
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

    const deleteNoteMutation = useMutation({
        mutationFn: (noteId: string) => notesApi.deleteFilingNote(noteId),
        onSuccess: () => {
            toast.info('Note deleted');

            queryClient.invalidateQueries({
                queryKey: ['userNotes']
            });
        },
        onError: (error: Error) => {
            toast.error('Failed to delete note');
        }
    });

    return {
        notes,
        availableTags: tagData?.tags,
        notesLoading: isLoading,
        deleteNote: deleteNoteMutation.mutate,

        addNoteTag: createNoteTagMutation.mutate,
        removeNoteTag: removeNoteTagMutation.mutate,
        applyNoteTag: applyNoteTagMutation.mutate,
    }
}

export default useUserNotes;