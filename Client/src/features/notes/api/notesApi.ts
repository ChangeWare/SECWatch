import {apiClient} from "@common/api/apiClient.ts";
import {
    CreateFilingNoteRequest,
    CreateFilingNoteResponse,
    GetFilingNotesResponse, UpdateFilingNoteRequest, UpdateFilingNoteResponse
} from "@features/notes/types.ts";

export const notesApi = {
    createFilingNote: async (req: CreateFilingNoteRequest): Promise<CreateFilingNoteResponse> => {
        const response = await apiClient.post<CreateFilingNoteResponse>(`/notes/filing-notes/${req.accessionNumber}/create`, req);
        return response.data;
    },
    getFilingNotes: async (accessionNumber: string): Promise<GetFilingNotesResponse> => {
        const response = await apiClient.get<GetFilingNotesResponse>(`/notes/filing-notes/${accessionNumber}`);
        return response.data;
    },
    updateFilingNote: async (req: UpdateFilingNoteRequest): Promise<UpdateFilingNoteResponse> => {
        const response = await apiClient.post<UpdateFilingNoteResponse>(`/notes/filing-notes/${req.accessionNumber}/update`, req);
        return response.data;
    },
    deleteFilingNote: async (noteId: string): Promise<string> => {
        await apiClient.delete(`/notes/filing-notes/${noteId}/delete`);
        return noteId;
    }
}