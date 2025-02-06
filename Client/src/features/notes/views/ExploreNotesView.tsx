import React, { useState, useMemo } from 'react';
import {Search, Filter, AlertCircle, FileText, Book, ChevronDown, Tag, PlusIcon} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card';
import Input  from '@common/components/Input';
import Button from '@common/components/Button';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@common/components/Collapsible';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@common/components/DropdownMenu';
import ScrollArea from '@common/components/ScrollArea';
import {FilingNote, Note, NoteTag} from "@features/notes/types.ts";
import CreateTagModal from "@features/notes/components/CreateTagModal.tsx";
import useUserNotes from "@features/notes/hooks/useUserNotes.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import NotesFilter, { FilterOption } from '../components/NotesFilter.tsx';



function ExploreNotesView() {

    const [createTagModalOpen, setCreateTagModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const { notes, notesLoading, addNoteTag, removeNoteTag } = useUserNotes();

    const availableTags = useMemo<NoteTag[]>(() => {
        if (!notes) return [];

        // we only want 1 of each tag with the same label
        const tags = new Map<string, NoteTag>();
        notes.forEach(note => {
            note.tags.forEach(tag => {
                tags.set(tag.label, tag);
            });
        });
        return Array.from(tags.values());
    }, [notes]);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);


    // Extract available filter options
    const filterOptions = useMemo(() => {
        return notes.reduce((acc, note) => {
            acc.companies.add(note.company.name);
            acc.filingTypes.add(note.form);
            acc.filingYears.add(note.filingDate.getFullYear());
            return acc;
        }, {
            companies: new Set<string>(),
            filingTypes: new Set<string>(),
            filingYears: new Set<number>(),
        });
    }, [notes]);

    const filterOptionsFormatted = useMemo(() => {
        const options: FilterOption[] = [];

        // Companies
        Array.from(filterOptions.companies).forEach(company => {
            options.push({
                id: company,
                label: company,
                value: company,
                category: 'Companies'
            });
        });

        // Filing Types
        Array.from(filterOptions.filingTypes).forEach(type => {
            options.push({
                id: type,
                label: type,
                value: type,
                category: 'Filing Types'
            });
        });

        // Filing Years
        Array.from(filterOptions.filingYears).forEach(year => {
            options.push({
                id: year.toString(),
                label: year.toString(),
                value: year,
                category: 'Filing Years'
            });
        });

        // Tags
        availableTags.forEach(tag => {
            options.push({
                id: tag.id,
                label: tag.label,
                value: tag.label,
                category: 'Tags'
            });
        });

        return options;
    }, [filterOptions, availableTags]);

    const filterCategories = ['Companies', 'Filing Types', 'Filing Years', 'Tags'];


    // Organize and filter notes
    const organizedNotes = useMemo(() => {
        const filtered = notes.filter(note => {
            // Search across note content and highlighted text
            const matchesSearch = searchQuery === '' ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.selectionData.selectedText.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply active filters
            const matchesFilters = activeFilters.every(filter => {
                switch (filter.category) {
                    case 'Companies':
                        return note.company.name === filter.value;
                    case 'Filing Types':
                        return note.form === filter.value;
                    case 'Filing Years':
                        return note.filingDate.getFullYear() === filter.value;
                    case 'Tags':
                        return note.tags.some(tag => tag.label === filter.value);
                    default:
                        return true;
                }
            });

            return matchesSearch && matchesFilters;
        });

        // Organize by company → filing type → filing year
        return filtered.reduce((acc, note) => {
            const company = note.company.name;
            const filingType = note.form;

            if (!acc[company]) acc[company] = {};
            if (!acc[company][filingType]) acc[company][filingType] = {};
            if (!acc[company][filingType][note.filingDate.getFullYear()]) {
                acc[company][filingType][note.filingDate.getFullYear()] = [];
            }
            acc[company][filingType][note.filingDate.getFullYear()].push(note);
            return acc;
        }, {} as Record<string, Record<string, Record<string, FilingNote[]>>>);
    }, [notes, searchQuery, activeFilters]);

    const handleCreateTag = (tag: NoteTag, note: Note) => {
        const req = {
            noteId: note.id,
            tag: {
                label: tag.label,
                color: tag.color,
            }
        }

        addNoteTag(req);
        setCreateTagModalOpen(false);
    }

    const onAddTag = (noteId: string, tag: NoteTag) => {
        const req = {
            noteId,
            tag: {
                label: tag.label,
                color: tag.color,
            }
        }

        addNoteTag(req);
    }

    const onRemoveTag = (noteId: string, tagId: string) => {
        const req = {
            noteId,
            tagId,
        }

        console.log(noteId);
        console.log(tagId);

        removeNoteTag(req);
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Research Notes</h1>
                    <p className="text-secondary mt-1">Search and explore your filing annotations</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col space-y-2 mb-4">
                <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Search Notes</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-4 h-4 w-4 text-secondary" />
                        <Input
                            placeholder="Search notes and highlights..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-12"
                        />
                    </div>
                </div>
                <NotesFilter
                    options={filterOptionsFormatted}
                    selectedFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    categories={filterCategories}
                />
            </div>

            <div>
                {/* Notes Display */}
                <div>
                    <LoadingIndicator isLoading={notesLoading}>
                        {Object.entries(organizedNotes).map(([company, filingTypes]) => (
                            <Collapsible key={company} className="mb-4">
                                <Card>
                                    <CollapsibleTrigger className="w-full">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <CardTitle>{company}</CardTitle>
                                                <div className="text-sm text-secondary">
                                                    ({Object.values(filingTypes).reduce((count, periods) =>
                                                    count + Object.values(periods).reduce((c, notes) => c + notes.length, 0), 0)} notes)
                                                </div>
                                            </div>
                                            <ChevronDown className="h-4 w-4" />
                                        </CardHeader>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <CardContent className="space-y-4">
                                            {Object.entries(filingTypes).map(([filingType, fiscalPeriods]) => (
                                                <Card key={filingType} variant="subtle">
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">{filingType}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {Object.entries(fiscalPeriods).map(([period, notes]) => (
                                                            <div key={period} className="mb-4">
                                                                <h4 className="text-sm font-medium text-secondary mb-3">{period}</h4>
                                                                <div className="space-y-3">
                                                                    {notes.map(note => (
                                                                        <Card key={note.id} variant="elevated" className="p-4">
                                                                            <div className="flex flex-col space-y-3">
                                                                                {/* Note Content */}
                                                                                <div className="font-medium">{note.content}</div>

                                                                                {/* Highlighted Text */}
                                                                                <div className="text-sm text-tertiary bg-surface-foreground/20 p-3 rounded-lg">
                                                                                    "{note.selectionData.selectedText}"
                                                                                </div>

                                                                                {/* Tags */}
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {note.tags?.map(tag => (
                                                                                        <div
                                                                                            key={tag.id}
                                                                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs"
                                                                                            style={{
                                                                                                backgroundColor: `${tag.color}20`,
                                                                                                color: tag.color,
                                                                                                border: `1px solid ${tag.color}40`
                                                                                            }}
                                                                                        >
                                                                                            {tag.label}
                                                                                            <button
                                                                                                onClick={() => onRemoveTag(note.id, tag.id)}
                                                                                                className="ml-1 hover:opacity-80"
                                                                                            >
                                                                                                ×
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button variant="foreground" size="sm" className="h-6">
                                                                                                <Tag className="w-3 h-3 mr-1" />
                                                                                                Add Tag
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        <DropdownMenuContent>
                                                                                            {availableTags
                                                                                                .filter(tag => !note.tags.find(t => t.label === tag.label))
                                                                                                .map(tag => (
                                                                                                    <DropdownMenuItem
                                                                                                        key={tag.id}
                                                                                                        onClick={() => onAddTag(note.id, tag)}
                                                                                                    >
                                                                                                        <div
                                                                                                            className="w-2 h-2 rounded-full mr-2"
                                                                                                            style={{ backgroundColor: tag.color }}
                                                                                                        />
                                                                                                        {tag.label}
                                                                                                    </DropdownMenuItem>
                                                                                                ))
                                                                                            }
                                                                                            <DropdownMenuItem
                                                                                                key="new-tag"
                                                                                                onClick={() => {
                                                                                                    setSelectedNote(note);
                                                                                                    setCreateTagModalOpen(true);
                                                                                                }}
                                                                                            >
                                                                                                <PlusIcon /> New Tag

                                                                                            </DropdownMenuItem>
                                                                                        </DropdownMenuContent>
                                                                                    </DropdownMenu>
                                                                                </div>

                                                                                {/* Actions */}
                                                                                <div className="flex justify-between items-center pt-2">
                                                                                    <div className="text-sm text-secondary">
                                                                                        Created {new Date(note.createdAt).toLocaleDateString()}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Button to={`/companies/${note.company.cik}/filings/${note.accessionNumber}`} variant="info" size="sm">
                                                                                            <FileText className="w-4 h-4 mr-2" />
                                                                                            View in Filing
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Card>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </LoadingIndicator>
                </div>
            </div>
            <CreateTagModal selectedNote={selectedNote!} open={createTagModalOpen} onClose={() => setCreateTagModalOpen(false)} onCreateTag={handleCreateTag} />
        </div>
    );
}

export default ExploreNotesView;