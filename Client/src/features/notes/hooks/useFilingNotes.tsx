import {useMutation, useQuery} from "@tanstack/react-query";
import {notesApi} from "@features/notes/api/notesApi.ts";
import {toast} from "react-toastify";
import queryClient from "@common/api/queryClient.ts";

const useFilingNotes = (accessionNumber?: string) => {

    const { data: notes, isLoading: notesLoading } = useQuery({
        queryKey: ['filingNotes', accessionNumber],
        queryFn: () => notesApi.getFilingNotes(accessionNumber!),
        enabled: !!accessionNumber,
        select: (data) => {
            return data.notes.map(note => ({
                ...note,
                createdAt: new Date(note.createdAt),
            }));
        }
    });

    const createNoteMutation = useMutation({
        mutationFn: notesApi.createFilingNote,
        onSuccess: (resp) => {
            toast.success('Note created successfully');

            queryClient.invalidateQueries({
                queryKey: ['filingNotes', accessionNumber]
            });
        },
        onError: (error: Error) => {
            toast.error('Failed to create note');
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: notesApi.updateFilingNote,
        onSuccess: (resp) => {
            toast.success('Note updated successfully');

            queryClient.invalidateQueries({
                queryKey: ['filingNotes', accessionNumber]
            });
        },
        onError: (error: Error) => {
            toast.error('Failed to update note');
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: notesApi.deleteFilingNote,
        onSuccess: (noteId: string) => {
            toast.success('Note deleted successfully');

            queryClient.invalidateQueries({
                queryKey: ['filingNotes', accessionNumber]
            });
        },
        onError: (error: Error) => {
            toast.error('Failed to delete note');
        }
    });

    return {
        notes,
        notesLoading,
        createNote: createNoteMutation.mutate,
        updateNote: updateNoteMutation.mutate,
        deleteNote: deleteNoteMutation.mutate,
    }
}

export default useFilingNotes;