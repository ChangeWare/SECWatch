import * as React from "react";
import { cn } from "@common/lib/utils";
import { Textarea as TextareaPrimitive } from "@common/components/ui/textarea";

type TextareaVariant = 'default' | 'subtle' | 'filled';
type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends React.ComponentPropsWithoutRef<typeof TextareaPrimitive> {
    variant?: TextareaVariant;
    size?: TextareaSize;
    error?: boolean;
    className?: string;
}

const Textarea = React.forwardRef<
    React.ElementRef<typeof TextareaPrimitive>,
    TextareaProps
>(({ className, variant = 'default', size = 'md', error, ...props }, ref) => {
    const variantStyles: Record<TextareaVariant, string> = {
        default: "bg-background border-border",
        subtle: "bg-surface-foreground/40 border-border/50",
        filled: "bg-surface border-transparent"
    };

    const sizes: Record<TextareaSize, string> = {
        sm: "p-2 text-sm",
        md: "p-3",
        lg: "p-4 text-lg"
    };

    return (
        <TextareaPrimitive
            ref={ref}
            className={cn(
                "flex min-h-[80px] w-full rounded-lg border",
                "text-foreground placeholder:text-secondary",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-error focus:ring-error/50",
                variantStyles[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";

export { Textarea };