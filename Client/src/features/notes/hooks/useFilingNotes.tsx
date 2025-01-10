import {useMutation, useQuery} from "@tanstack/react-query";
import {notesApi} from "@features/notes/api/notesApi.ts";
import {toast} from "react-toastify";
import queryClient from "@common/api/queryClient.ts";

const useFilingNotes = (accessionNumber?: string) => {

    const { data: notes, isLoading: notesLoading } = useQuery({
        queryKey: ['filingNotes', accessionNumber],
        queryFn: () => notesApi.getFilingNotes(accessionNumber!),
        enabled: !!accessionNumber,
        select: (data) => data?.notes
    });

    const createNoteMutation = useMutation({
        mutationFn: notesApi.createFilingNote,
        onSuccess: (resp) => {
            toast.success('Note created successfully');

            // Refresh notes query with new data
            // Avoids making an additional request to get the latest notes
            queryClient.setQueryData(['filingNotes', accessionNumber],
                { notes: [...notes ?? [], resp.note] });
        },
        onError: (error: Error) => {
            toast.error('Failed to create note');
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: notesApi.updateFilingNote,
        onSuccess: (resp) => {
            toast.success('Note updated successfully');

            // Refresh notes query with updated data
            queryClient.setQueryData(['filingNotes', accessionNumber],
                { notes: notes?.map(note =>
                    note.id === resp.note.id ? resp.note : note
                ) });
        },
        onError: (error: Error) => {
            toast.error('Failed to update note');
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: notesApi.deleteFilingNote,
        onSuccess: (noteId: string) => {
            toast.success('Note deleted successfully');

            // Refresh notes query with updated data
            queryClient.setQueryData(['filingNotes', accessionNumber],
                { notes: notes?.filter(note => note.id !== noteId) });
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