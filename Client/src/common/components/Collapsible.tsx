import * as React from "react";
import { cn } from "@common/lib/utils";
import {
    Collapsible as CollapsiblePrimitive,
    CollapsibleTrigger as CollapsibleTriggerPrimitive,
    CollapsibleContent as CollapsibleContentPrimitive,
} from "@common/components/ui/collapsible";

type CollapsibleVariant = 'default' | 'subtle' | 'bordered';

interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive> {
    variant?: CollapsibleVariant;
    className?: string;
    defaultOpen?: boolean;
}

const Collapsible = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive>,
    CollapsibleProps
>(({ className, variant = 'default', defaultOpen = true, ...props }, ref) => {
    const variantStyles: Record<CollapsibleVariant, string> = {
        default: "bg-surface",
        subtle: "bg-surface-foreground/40",
        bordered: "border border-border rounded-lg"
    };

    return (
        <CollapsiblePrimitive
            ref={ref}
            defaultOpen={defaultOpen}
            className={cn(
                variantStyles[variant],
                "w-full",
                className
            )}
            {...props}
        />
    );
});
Collapsible.displayName = "Collapsible";

interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsibleTriggerPrimitive> {
    className?: string;
}

const CollapsibleTrigger = React.forwardRef<
    React.ElementRef<typeof CollapsibleTriggerPrimitive>,
    CollapsibleTriggerProps
>(({ className, ...props }, ref) => (
    <CollapsibleTriggerPrimitive
        ref={ref}
        className={cn(
            "flex w-full items-center justify-between px-4 py-2",
            "text-sm font-medium transition-all hover:bg-surface-foreground/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "[&[data-state=open]>svg]:rotate-180",
            className
        )}
        {...props}
    />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<typeof CollapsibleContentPrimitive> {
    className?: string;
}

const CollapsibleContent = React.forwardRef<
    React.ElementRef<typeof CollapsibleContentPrimitive>,
    CollapsibleContentProps
>(({ className, ...props }, ref) => (
    <CollapsibleContentPrimitive
        ref={ref}
        className={cn(
            "overflow-hidden px-4 transition-all",
            "data-[state=closed]:animate-collapsible-up",
            "data-[state=open]:animate-collapsible-down",
            className
        )}
        {...props}
    />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };