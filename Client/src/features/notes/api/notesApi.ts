import {apiClient} from "@common/api/apiClient.ts";
import {
    ApplyNoteTagRequest, AvailableTagsResponse,
    CreateNoteRequest, CreateNoteResponse, CreateNoteTagRequest, DeleteNoteTagRequest,
    GetFilingNotesResponse, GetUserNotesResponse, UpdateNoteRequest, UpdateNoteResponse
} from "./types.ts";

export const notesApi = {
    createNote: async (req: CreateNoteRequest): Promise<CreateNoteResponse> => {
        const response = await apiClient.post<CreateNoteResponse>(`/notes/create`, req);
        return response.data;
    },
    updateNote: async (req: UpdateNoteRequest): Promise<UpdateNoteResponse> => {
        const response = await apiClient.post<UpdateNoteResponse>(`/notes/update`, req);
        return response.data;
    },
    deleteFilingNote: async (noteId: string): Promise<string> => {
        await apiClient.delete(`/notes/${noteId}`);
        return noteId;
    },
    getFilingNotes: async (accessionNumber: string): Promise<GetFilingNotesResponse> => {
        const response = await apiClient.get<GetFilingNotesResponse>(`/notes/filing-notes/${accessionNumber}`);
        return response.data;
    },
    getUserNotes: async (): Promise<GetUserNotesResponse> => {
        const response = await apiClient.get('/notes');
        return response.data;
    },
    applyNoteTag: async (req: ApplyNoteTagRequest) => {
        const response = await apiClient.post(`/notes/tags/${req.tagId}/apply/${req.noteId}`, req);
        return response.data;
    },
    addNoteTag: async (req: CreateNoteTagRequest) => {
        const response = await apiClient.post(`/notes/${req.noteId}/tags`, req);
        return response.data;
    },
    removeNoteTag: async (req: DeleteNoteTagRequest) => {
        const response = await apiClient.delete(`/notes/${req.noteId}/tags/${req.tagId}`);
        return response.data;
    },
    getAvailableTags: async (): Promise<AvailableTagsResponse> => {
        const response = await apiClient.get('/notes/tags');
        return response.data;
    }
}