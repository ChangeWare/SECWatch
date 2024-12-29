import * as React from "react";
import { cn } from "@common/lib/utils.ts";
import {
    Card as CardPrimitive,
    CardHeader as CardHeaderPrimitive,
    CardTitle as CardTitlePrimitive,
    CardContent as CardContentPrimitive,
} from "@common/components/ui/card.tsx";

type CardVariant = 'default' | 'subtle' | 'elevated';

interface CardProps extends React.ComponentPropsWithoutRef<typeof CardPrimitive> {
    variant?: CardVariant;
    interactive?: boolean;
}

const Card = React.forwardRef<
    React.ElementRef<typeof CardPrimitive>,
    CardProps
>(({ className, ...props }, ref) => {

    const variantStyles: Record<CardVariant, string> = {
        default: "bg-surface",
        subtle: "bg-surface-foreground/40 shadow-sm",
        elevated: "bg-surface-foreground shadow-md",
    };

    const baseStyles = "rounded-xl border border-border hover:border-success/50 transition";

    return (
        <CardPrimitive
            ref={ref}
            className={cn(
                variantStyles[props.variant || 'default'],
                baseStyles,
                props.interactive && "cursor-pointer",
                className
            )}
            {...props}
        />
    );
});

const CardHeader = React.forwardRef<
    React.ElementRef<typeof CardHeaderPrimitive>,
    React.ComponentPropsWithoutRef<typeof CardHeaderPrimitive>
>(({ className, ...props }, ref) => (
    <CardHeaderPrimitive
        ref={ref}
        className={cn(
            "flex flex-col space-y-1.5 p-6",
            className
        )}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    React.ElementRef<typeof CardTitlePrimitive>,
    React.ComponentPropsWithoutRef<typeof CardTitlePrimitive>
>(({ className, ...props }, ref) => (
    <CardTitlePrimitive
        ref={ref}
        className={cn(
            "text-xl font-semibold text-white leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
    React.ElementRef<typeof CardContentPrimitive>,
    React.ComponentPropsWithoutRef<typeof CardContentPrimitive>
>(({ className, ...props }, ref) => (
    <CardContentPrimitive
        ref={ref}
        className={cn(
            "p-6 pt-0",
            className
        )}
        {...props}
    />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };