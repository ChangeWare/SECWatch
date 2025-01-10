export interface SelectionData {

}

export interface FilingNoteSelectionData extends SelectionData {
    startXPath: string;      // XPath to start node
    startOffset: number;     // Offset within start node
    endXPath: string;        // XPath to end node
    endOffset: number;       // Offset within end node
    selectedText: string;    // For validation
    selectionType: 'text' | 'table'; // Future-proofing for different selection types
    tableData?: {
        entireTable: boolean;
        tableXPath: string;
        tableElement: HTMLTableElement;
    };
}


export interface Note {
    id: string;
    content: string;
    color: string;
    createdAt: Date;
    selectionData: SelectionData;
}

export interface FilingNote extends Note {
    accessionNumber: string;
    selectionData: FilingNoteSelectionData;
}

export interface GetFilingNotesResponse {
    notes: FilingNote[];
    count: number;
}

export interface CreateFilingNoteRequest {
    content: string;
    color: string;
    accessionNumber: string;
    selectionData: FilingNoteSelectionData;
}

export interface CreateFilingNoteResponse {
    success: boolean;
    note: FilingNote;
}

export interface UpdateFilingNoteResponse extends CreateFilingNoteResponse {

}

export interface UpdateFilingNoteRequest extends CreateFilingNoteRequest {
}