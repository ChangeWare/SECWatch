import React from 'react';
import { useParams } from "react-router-dom";
import IXBRLViewer, {IXBRLLoadingIndicator} from "@features/filings/components/XBRLViewer.tsx";
import useCompany from "@features/company/hooks/useCompany.tsx";
import useSecFiling from "@features/filings/hooks/useSecFiling.ts";
import {CreateFilingNoteRequest, FilingNote} from "@features/notes/types.ts";
import useFilingNotes from "@features/notes/hooks/useFilingNotes.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";

export function CompanyFilingView() {
    const { companyId, accessionNumber } = useParams();

    const { company } = useCompany(companyId);
    const { filing, filingContents } = useSecFiling({
        companyId,
        accessionNumber,
    });

    const { notes, createNote, deleteNote, updateNote } = useFilingNotes(accessionNumber);

    const handleCreateNote = (note: CreateFilingNoteRequest) => {
        createNote(note);
    };

    const handleUpdateNote = (updatedNote: FilingNote) => {
        updateNote(updatedNote);
    };

    const handleDeleteNote = (id: string) => {
        deleteNote(id);
    };

    return (
        <div className="max-w-full overflow-x-hidden px-4">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Filing Viewer</h2>
                <p className="text-secondary mt-2">
                    Viewing Form {filing?.form} filing ({filing?.filingDate?.toLocaleDateString()}) for {company?.name}
                </p>
            </div>

            <LoadingIndicator isLoading={!filingContents} ContainerComponent={IXBRLLoadingIndicator}>
                <IXBRLViewer
                    accessionNumber={accessionNumber!}
                    filingContents={filingContents!}
                    notes={notes}
                    onNoteCreate={handleCreateNote}
                    onNoteUpdate={handleUpdateNote}
                    onNoteDelete={handleDeleteNote}
                />
            </LoadingIndicator>
        </div>
    );
}