import {FilingNote, FilingNoteSelectionData, Note, SelectionData, Tag} from "@features/notes/types.ts";

export interface GetFilingNotesResponse {
    notes: FilingNote[];
    count: number;
}

export interface GetUserNotesResponse {
    notes: FilingNote[];
    count: number;
}

export interface NoteInfo {
    id?: string;
    type: string;
}

export interface NoteTagInfo {
    tagId?: string;
    noteTagId?: string;
    label: string;
    color: string;
}

export interface FilingNoteInfo extends NoteInfo {
    type: 'filing';
    content: string;
    color: string;
    selectionData: FilingNoteSelectionData;
    form: string;
    cik: string;
    filingDate: Date;
    reportDate?: Date;
    accessionNumber: string;
}

export interface CreateNoteTagRequest {
    noteId: string;
    tag: NoteTagInfo;
}

export interface ApplyNoteTagRequest {
    noteId: string;
    tagId: string;
}

export interface DeleteNoteTagRequest {
    noteId: string;
    tagId: string;
}

export interface CreateNoteRequest {
    note: NoteInfo;
}

export interface UpdateNoteRequest {
    note: NoteInfo;
}

export interface UpdateNoteResponse {
    note: Note;
}

export interface CreateNoteResponse {
    note: Note;
}

export interface AvailableTagsResponse {
    tags: Tag[];
}