import {CompanyDetails} from "@features/company/types.ts";
import {CompanyFiling} from "@features/filings/types.ts";

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

export interface NoteTag {
    tagId: string;
    noteTagId: string;
    label: string;
    color: string;
}

export interface Tag {
    id: string;
    label: string;
    color: string;
}

export interface Note {
    id: string;
    noteType: string;
    tags: NoteTag[];
    content: string;
    color: string;
    createdAt: Date;
    selectionData: SelectionData;
}

export interface FilingNote extends Note {
    selectionData: FilingNoteSelectionData;
    accessionNumber: string;
    filingDate: Date;
    reportDate?: Date;
    company: CompanyDetails;
    form: string;
}