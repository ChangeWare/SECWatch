import * as React from "react";
import { cn } from "@common/lib/utils";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export type DialogVariant = 'default' | 'wide' | 'fullscreen';
export type DialogColor = 'surface' | 'primary' | 'subtle';

export interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
    variant?: DialogVariant;
    color?: DialogColor;
}

const Dialog = DialogPrimitive.Root;

export interface DialogContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    variant?: DialogVariant;
    color?: DialogColor;
    showClose?: boolean;
    onClose?: () => void;
}

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({ className, children, variant = 'default', color = 'surface', showClose = true, onClose, ...props }, ref) => {
    const baseStyles = "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] duration-200 gap-4";

    const variants: Record<DialogVariant, string> = {
        default: "w-full max-w-lg",
        wide: "w-full max-w-3xl",
        fullscreen: "w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-none"
    };

    const colors: Record<DialogColor, string> = {
        surface: "bg-surface",
        primary: "bg-primary/5",
        subtle: "bg-surface-foreground/40"
    };

    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className={cn(
                    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                )}
            />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    colors[color],
                    "border border-border rounded-xl p-6 shadow-lg",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    className
                )}
                {...props}
            >
                {children}
                {showClose && (
                    <DialogPrimitive.Close
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const baseStyles = "flex flex-col space-y-1.5 text-center sm:text-left";

    return (
        <div
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
    const baseStyles = "text-lg font-semibold leading-none tracking-tight text-foreground";

    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-secondary", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

export {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription
};