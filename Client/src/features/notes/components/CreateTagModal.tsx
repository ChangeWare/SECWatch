import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/common/components/Dialog";
import Button from "@common/components/Button";
import Input from "@common/components/Input";
import Label from "@common/components/Label";
import {Note, NoteTag} from '../types';
import {cn} from "@common/lib/utils.ts";

const PRESET_COLORS = [
    '#F43F5E', // error/red
    '#FB8500', // metrics-strong/orange
    '#FFB703', // metrics-growth/yellow
    '#10B981', // success/green
    '#0EA5E9', // info/blue
    '#4F46E5', // primary/indigo
];

interface CreateTagModalProps {
    open: boolean;
    onClose: () => void;
    onCreateTag: (tag: NoteTag, note: Note) => void;
    selectedNote: Note;
}


function CreateTagModal (props: CreateTagModalProps) {
    const { open, onClose, onCreateTag, selectedNote } = props;

    const [tagName, setTagName] = React.useState('');
    const [selectedColor, setSelectedColor] = React.useState(PRESET_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tagName.trim() && selectedColor) {
            onCreateTag({
                tagId: '',
                noteTagId: '',
                label: tagName.trim(),
                color: selectedColor
            }, selectedNote);
            setTagName('');
            setSelectedColor(PRESET_COLORS[0]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-surface border-border sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Create New Tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="tagName" className="text-foreground">
                            Tag Name
                        </Label>
                        <Input
                            id="tagName"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            placeholder="Enter tag name"
                            className="bg-background border-border text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Tag Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2",
                                        selectedColor === color
                                            ? "border-foreground"
                                            : "border-transparent"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="foreground"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!tagName.trim() || !selectedColor}
                        >
                            Create Tag
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTagModal;