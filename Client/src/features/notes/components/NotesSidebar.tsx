import { Card, CardContent, CardHeader, CardTitle } from "@common/components/Card.tsx";
import ScrollArea from "@common/components/ScrollArea.tsx";
import Alert from "@common/components/Alert.tsx";
import { PanelRightClose, Pencil, Trash2 } from "lucide-react";
import {FilingNote, Note} from "@features/notes/types.ts";
import HyperLink from "@common/components/HyperLink.tsx";

interface NotesSidebarProps<T extends Note> {
    notes: T[];
    highlightedNoteId?: string;
    onNoteClick: (note: T) => void;
    onNoteDelete: (id: string) => void;
    onNoteEdit: (note: T) => void;
    onClose: () => void;
}

function NotesSidebar<T extends Note>(props: NotesSidebarProps<T>) {
    const {
        notes,
        highlightedNoteId,
        onNoteClick,
        onNoteDelete,
        onNoteEdit,
        onClose
    } = props;

    return (
        <div className="w-[300px] flex-none">
            <Card className="h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Notes ({notes.length})</CardTitle>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-surface rounded-lg transition-colors"
                        >
                            <PanelRightClose className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea maxHeight="calc(100vh - 12rem)">
                        <div className="space-y-4 pr-4">
                            {notes.length === 0 ? (
                                <Alert variant="info">
                                    No notes yet. Select text in the document to add notes.
                                </Alert>
                            ) : (
                                notes.map((note) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        isHighlighted={note.id === highlightedNoteId}
                                        onClick={() => onNoteClick(note)}
                                        onDelete={() => onNoteDelete(note.id)}
                                        onEdit={() => onNoteEdit(note)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

interface NoteCardProps<T extends Note> {
    note: T;
    isHighlighted: boolean;
    onClick: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onTableClick?: (note: FilingNote) => void;
}

function isFilingNote(note: Note): note is FilingNote {
    return (note as FilingNote) !== undefined;
}

function NoteCard<T extends Note>(props: NoteCardProps<T>) {
    const {
        note,
        onClick,
        onDelete,
        onEdit,
        isHighlighted
    } = props;

    const renderNoteSelection = () => {
        if (isFilingNote(note)) {
            return (
                <p className="text-sm text-tertiary line-clamp-3">
                    {note.selectionData.selectionType === 'text' ? (
                        note.selectionData.selectedText
                        ) : (
                            "Table Note"
                        )
                    }
                </p>
            );
        }
    }

    return (
        <Card
            variant="elevated"
            id={note.id}
            onClick={onClick}
            className={`p-4 hover:border-info transition cursor-pointer group
                ${isHighlighted ? 'border-info' : ''}`}
        >
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium line-clamp-2">{note.content}</p>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-1 hover:bg-surface rounded"
                        >
                            <Pencil className="h-4 w-4 text-info" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-1 hover:bg-surface rounded"
                        >
                            <Trash2 className="h-4 w-4 text-error" />
                        </button>
                    </div>
                </div>
                {renderNoteSelection()}
                <p className="text-xs text-secondary">
                    {note.createdAt.toLocaleDateString()}
                </p>
            </div>
        </Card>
    );
}

export default NotesSidebar;