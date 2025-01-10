import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/Card.tsx";

interface Position {
    x: number;
    y: number;
}

interface AddNotePopoverProps {
    position: Position;
    onSubmit: (content: string) => void;
    onCancel: () => void;
}

const AddNotePopover: React.FC<AddNotePopoverProps> = (props: AddNotePopoverProps) => {
    const {
        position,
        onSubmit,
        onCancel
    } = props;

    const [noteContent, setNoteContent] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    useEffect(() => {
        // Adjust position to keep popover in viewport
        if (popoverRef.current) {
            const rect = popoverRef.current.getBoundingClientRect();
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            let newX = position.x;
            let newY = position.y;

            // Adjust horizontal position if needed
            if (position.x + rect.width > viewport.width) {
                newX = viewport.width - rect.width - 20; // 20px padding from edge
            }

            // Adjust vertical position if needed
            if (position.y + rect.height > viewport.height) {
                newY = position.y - rect.height - 10; // Position above selection
            }

            setAdjustedPosition({ x: newX, y: newY });
        }
    }, [position]);

    return (
        <div
            ref={popoverRef}
            style={{
                position: 'fixed',
                left: `${adjustedPosition.x}px`,
                top: `${adjustedPosition.y}px`,
                zIndex: 1000
            }}
        >
            <Card className="w-80 shadow-lg">
                <CardHeader className="py-3">
                    <CardTitle className="text-lg">Add Note</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Note</label>
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                className="mt-1 w-full h-24 p-2 rounded-md border border-border bg-surface text-foreground"
                                placeholder="Enter your note..."
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm rounded-md hover:bg-surface transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onSubmit(noteContent)}
                                disabled={!noteContent.trim()}
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition disabled:opacity-50"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddNotePopover;