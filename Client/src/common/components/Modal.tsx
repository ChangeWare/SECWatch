// components/Modal.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@common/components/ui/dialog";

interface ModalProps {
    title?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: string;  // e.g., 'sm', 'md', 'lg', 'xl', '2xl', etc.
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function Modal({
                          isOpen,
                          onClose,
                          title,
                          children,
                          maxWidth = '2xl',
                          className,
                      }: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`bg-background max-w-${maxWidth} ${className || ''}`}>
                {title && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default Modal;