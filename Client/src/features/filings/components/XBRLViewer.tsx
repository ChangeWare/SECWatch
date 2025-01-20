import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Card, CardContent} from "@common/components/Card.tsx";
import NotesSidebar from '../../notes/components/NotesSidebar.tsx';
import AddNotePopover from "../../notes/components/AddNotePopover.tsx";
import {PanelRightOpen} from "lucide-react";
import {CreateFilingNoteRequest, FilingNote, FilingNoteSelectionData} from "@features/notes/types.ts";
import secDocumentStyles from '../styles/filing.css?raw';
import noteStyles from '../styles/noteStyles.css?raw'
import {getNodeFromXPath, getProxiedImageSrc, getXPathForNode} from "@features/filings/utils.ts";

interface IXBRLViewerProps {
    filingContents: string;
    accessionNumber: string;
    cik: string;
    notes?: FilingNote[];
    onNoteCreate: (note: CreateFilingNoteRequest) => void;
    onNoteUpdate: (note: FilingNote) => void;
    onNoteDelete: (id: string) => void;
}

export const IXBRLLoadingIndicator: React.FC<{
    children: React.ReactNode;
    loader: React.ReactNode;
    isLoading: boolean;
}> = ({ children, loader, isLoading }) => {
    return (
        isLoading ? (
            <Card>
                <CardContent>
                    {loader}
                </CardContent>
            </Card>
        ) : children
    )
};

const IXBRLViewer: React.FC<IXBRLViewerProps> = (props: IXBRLViewerProps) => {
    const {
        filingContents,
        notes = [],
        onNoteCreate,
        onNoteUpdate,
        onNoteDelete,
        accessionNumber,
        cik
    } = props;

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selection, setSelection] = useState<FilingNoteSelectionData | null>(null);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hoveredNoteId, setHoveredNoteId] = useState<string | undefined>(undefined);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hoveredTable, setHoveredTable] = useState<HTMLTableElement | null>(null);

    const isNotableTable = (table: HTMLTableElement): boolean => {

        // Check if this is a nested table
        // Generally, these aren't useful to add notes to
        const isNested = table.closest('td, th') !== null;
        if (isNested) return false;

        // 1. Tables with "Table I" or "Table II" in their text are definitely data tables
        const tableText = table.textContent?.trim() || '';
        if (tableText.includes('Table I') || tableText.includes('Table II')) {
            return true;
        }

        // 2. Check for complex header structure (th elements or thead)
        const hasHeaders = table.querySelectorAll('th').length > 0 ||
            table.querySelector('thead') !== null;

        // 3. Check for substantial data content
        const rows = table.querySelectorAll('tr');
        const hasMeaningfulRows = rows.length > 2; // More than just a header and one data row

        // 4. Check for specific SEC table classes or patterns
        const hasSecClasses = table.className.includes('FormData') ||
            table.querySelector('.FormData') !== null;

        // 5. Look for numeric content in cells (common in financial tables)
        const cells = table.querySelectorAll('td');
        const hasNumericCells = Array.from(cells).some(cell => {
            const text = cell.textContent?.trim() || '';
            return /\d+\.?\d*/.test(text) && !/^(?:\d{1,2}\/){2}\d{4}$/.test(text); // Has numbers but isn't just a date
        });

        // Return true only if this appears to be a data table
        return (hasHeaders && hasMeaningfulRows) ||
            (hasSecClasses && hasNumericCells);
    };

    // Clean up the content and add necessary styles
    const cleanContent = (content: string) => {
        const cleanedContent = content
            .replace(/�/g, "'")
            .replace(/[\u0080-\u009F]/g, '')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(
                /<link[^>]*?SDR_print[^>]*?>/gi,
                `<style>${secDocumentStyles}</style>`
            )
            // Fix image src URLs
            .replace(/<img[^>]+src="([^"]+)"/g, (match, src) => {
                const newSrc = getProxiedImageSrc(src, cik, accessionNumber);
                return match.replace(src, newSrc);
            });

        // Add our custom styles
        return `
            <style>
                ${noteStyles}
            </style>
            ${cleanedContent}
        `;
    };

    const handleNoteClick = (note: FilingNote) => {
        const doc = iframeRef.current?.contentWindow?.document;
        if (!doc) return;

        const highlight = doc.querySelector(`.note-${note.id}`);
        if (highlight) {
            highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setIsSidebarOpen(true);
    };

    const handleTableClick = (table: HTMLTableElement) => {
        const tableRect = table.getBoundingClientRect();
        const iframeRect = iframeRef.current?.getBoundingClientRect();

        if (iframeRect) {
            setPopoverPosition({
                x: iframeRect.left + tableRect.right + 30, // Offset to not overlap with note indicator
                y: iframeRect.top + tableRect.top
            });

            const tableXPath = getXPathForNode(table);
            setSelection({
                startXPath: tableXPath,
                endXPath: tableXPath,
                startOffset: 0,
                endOffset: 0,
                selectedText: 'Selected Table',
                selectionType: 'table',
                tableData: {
                    tableXPath,
                    entireTable: true,
                    tableElement: table
                }
            });
            setIsAddingNote(true);
        }
    };

    const handleSelection = (e: MouseEvent) => {
        const iframeWindow = iframeRef.current?.contentWindow;
        if (!iframeWindow) return;

        const selection = iframeWindow.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const text = range.toString().trim();

        if (text) {
            const startXPath = getXPathForNode(range.startContainer);
            const endXPath = getXPathForNode(range.endContainer);

            if (startXPath && endXPath) {
                // Get the bounding rectangle of the selection
                const rects = range.getClientRects();
                const lastRect = rects[rects.length - 1];

                // Get the iframe's position
                const iframeRect = iframeRef.current?.getBoundingClientRect();

                if (lastRect && iframeRect) {
                    // Calculate position for popover
                    const x = iframeRect.left + lastRect.right;
                    const y = iframeRect.top + lastRect.top;
                    setPopoverPosition({x, y});
                    setSelection({
                        startXPath,
                        startOffset: range.startOffset,
                        endXPath,
                        endOffset: range.endOffset,
                        selectedText: text,
                        selectionType: 'text'
                    });
                    setIsAddingNote(true);
                }
            }
        }
    };

    const getIndicatorPosition = (table: HTMLTableElement, doc: Document): { right: string, top: string } => {
        const tableRect = table.getBoundingClientRect();
        const iframeWidth = doc.documentElement.clientWidth;
        const spaceOnRight = iframeWidth - tableRect.right;

        // If we have less than 30px on the right, position the indicator on the inside
        if (spaceOnRight < 30) {
            return {
                right: '16px', // Position inside the table
                top: '0px'
            };
        }

        return {
            right: '-28px',
            top: '0'
        };
    };

    const renderTableIndicators = useCallback(() => {
        const doc = iframeRef.current?.contentWindow?.document;
        if (!doc) return;

        // Remove existing table indicators
        doc.querySelectorAll('.table-interaction').forEach(el => el.remove());

        // Add interaction elements only for notable tables
        doc.querySelectorAll('table').forEach(table => {
            if (!isNotableTable(table)) return;

            // Mark table as hoverable
            table.setAttribute('data-hoverable', 'true');

            // Find if table has notes
            const tableXPath = getXPathForNode(table);
            const hasNote = notes.some(note =>
                note.selectionData.selectionType === 'table' &&
                note.selectionData.tableData?.tableXPath === tableXPath
            );

            if (hasNote) {
                table.setAttribute('data-has-note', 'true');
            }

            // Get the appropriate position for the indicator
            const { right, top } = getIndicatorPosition(table, doc);

            // Create container for note indicator
            const container = doc.createElement('div');
            container.className = 'table-note-container';
            Object.assign(container.style, {
                right,
                top
            });

            const indicator = doc.createElement('div');
            indicator.className = `table-note-indicator ${hasNote ? 'has-note' : 'no-note'}`;
            // Add a class if we're positioning inside the table
            if (right === '8px') {
                indicator.classList.add('inside-table');
            }

            indicator.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        `;

            // Add click handler
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                if (hasNote) {
                    const note = notes.find(n =>
                        n.selectionData.selectionType === 'table' &&
                        n.selectionData.tableData?.tableXPath === tableXPath
                    );
                    if (note) handleNoteClick(note);
                } else {
                    handleTableClick(table);
                }
            });

            container.appendChild(indicator);
            table.appendChild(container);
        });
    }, [notes, handleNoteClick]);

    const renderHighlights = useCallback(() => {
        const doc = iframeRef.current?.contentWindow?.document;
        if (!doc) return;

        // Remove existing highlights
        doc.querySelectorAll('.note-highlight, .note-highlight-clickable').forEach(el => el.remove());

        // Create new highlights
        notes.forEach(note => {
            const startNode = getNodeFromXPath(note.selectionData.startXPath, doc);
            const endNode = getNodeFromXPath(note.selectionData.endXPath, doc);

            if (!startNode || !endNode) return;

            try {
                const range = doc.createRange();
                range.setStart(startNode, note.selectionData.startOffset);
                range.setEnd(endNode, note.selectionData.endOffset);

                const rects = range.getClientRects();
                Array.from(rects).forEach((rect) => {
                    // Create the visual highlight with pointer-events: none
                    const highlight = doc.createElement('div');
                    highlight.className = `note-highlight note-${note.id}`;
                    highlight.style.left = `${rect.left}px`;
                    highlight.style.top = `${rect.top}px`;
                    highlight.style.width = `${rect.width}px`;
                    highlight.style.height = `${rect.height}px`;
                    highlight.style.backgroundColor = hoveredNoteId === note.id ?
                        'rgba(255, 227, 118, 0.7)' :
                        'rgba(255, 227, 118, 0.5)';
                    doc.body.appendChild(highlight);

                    // Create a separate transparent clickable layer
                    const clickableHighlight = doc.createElement('div');
                    clickableHighlight.className = `note-highlight-clickable note-${note.id}`;
                    clickableHighlight.style.left = `${rect.left}px`;
                    clickableHighlight.style.top = `${rect.top}px`;
                    clickableHighlight.style.width = `${rect.width}px`;
                    clickableHighlight.style.height = `${rect.height}px`;

                    clickableHighlight.addEventListener('mouseenter', () => setHoveredNoteId(note.id));
                    clickableHighlight.addEventListener('mouseleave', () => setHoveredNoteId(undefined));
                    clickableHighlight.addEventListener('click', () => handleNoteClick(note));

                    doc.body.appendChild(clickableHighlight);
                });
            } catch (error) {
                console.error('Error rendering highlight:', error);
            }
        });
    }, [notes, hoveredNoteId, handleNoteClick]);

    const createNote = (content: string) => {
        if (!selection || !onNoteCreate) return;

        const newNote: CreateFilingNoteRequest = {
            content,
            color: '#FFE176',
            accessionNumber,
            selectionData: selection
        };

        onNoteCreate(newNote);
        setSelection(null);
        setIsAddingNote(false);
    };

    useEffect(() => {
        if (filingContents && iframeRef.current?.contentWindow) {
            const iframe = iframeRef.current;
            const doc = iframe.contentWindow?.document;

            if (!doc) return;

            doc.open();
            doc.write(cleanContent(filingContents));
            doc.close();


            // Add event listeners with a slight delay to ensure proper text selection
            const handleMouseUp = (e: MouseEvent) => {
                // Only handle selection if we're not clicking a highlight
                if (!(e.target as HTMLElement).closest('.note-highlight-clickable')) {
                    setTimeout(() => handleSelection(e), 0);
                }
            };

            const handleClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;

                // Skip if clicking on note indicators or highlights
                if (target.closest('.table-note-indicator') || target.closest('.note-highlight-clickable')) {
                    return;
                }

                // Check for table click
                const table = target.closest('table');
                if (table && table.getAttribute('data-hoverable') === 'true') {
                    handleTableClick(table);
                }
            };

            const handleTableHover = (e: MouseEvent) => {
                const table = (e.target as HTMLElement).closest('table');
                setHoveredTable(table);
            };

            doc.addEventListener('mouseover', handleTableHover);
            doc.addEventListener('mouseout', () => setHoveredTable(null));
            doc.addEventListener('mouseup', handleMouseUp);
            doc.addEventListener('click', handleClick);

            // Handle iframe resizing
            const resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => {
                    iframe.style.height = doc.documentElement.scrollHeight + 'px';
                    renderHighlights();
                });
            });

            resizeObserver.observe(doc.body);

            return () => {
                doc.removeEventListener('mouseup', handleMouseUp);
                doc.removeEventListener('click', handleClick);
                resizeObserver.disconnect();
            };
        }
    }, [filingContents]);

    // Update highlights when notes or hover state changes
    useEffect(() => {
        renderHighlights();
    }, [notes, hoveredNoteId, renderHighlights]);

    useEffect(() => {
        renderTableIndicators();
    }, [notes, hoveredTable, renderTableIndicators]);

    return (
        <div className="space-y-4 max-w-full">
            <div className="flex justify-end">
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="h-10 px-3 bg-surface hover:bg-surface-foreground rounded-lg transition-colors flex items-center gap-2"
                    >
                        <PanelRightOpen className="h-5 w-5" />
                        <span className="text-sm">Show Notes</span>
                    </button>
                )}
            </div>

            <div className="flex gap-4">
                <Card variant="default" className={`p-4 transition-all duration-300 ${
                    isSidebarOpen ? 'w-[calc(100%-320px)]' : 'w-full'}`}
                >
                    <CardContent>
                        <>
                            {selection && isAddingNote && (
                                <AddNotePopover
                                    onSubmit={createNote}
                                    position={popoverPosition}
                                    onCancel={() => {
                                        setSelection(null);
                                        setIsAddingNote(false);
                                    }}
                                />
                            )}
                            <iframe
                                ref={iframeRef}
                                className="w-full border-none bg-white"
                                title="SEC Filing Content"
                            />
                        </>
                    </CardContent>
                </Card>

                {isSidebarOpen && (
                    <div className="w-[300px] shrink-0">
                        <NotesSidebar
                            highlightedNoteId={hoveredNoteId}
                            notes={notes}
                            onClose={() => setIsSidebarOpen(false)}
                            onNoteClick={handleNoteClick}
                            onNoteDelete={onNoteDelete}
                            onNoteEdit={onNoteUpdate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IXBRLViewer;