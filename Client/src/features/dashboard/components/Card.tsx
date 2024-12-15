import * as React from "react";
import { cn } from "@/common/lib/utils";
import {
    Card as CardPrimitive,
    CardHeader as CardHeaderPrimitive,
    CardTitle as CardTitlePrimitive,
    CardContent as CardContentPrimitive,
} from "@/common/components/ui/card";

const Card = React.forwardRef<
    React.ElementRef<typeof CardPrimitive>,
    React.ComponentPropsWithoutRef<typeof CardPrimitive>
>(({ className, ...props }, ref) => (
    <CardPrimitive
        ref={ref}
        className={cn(
            // Override any default background colors from shadcn
            "!bg-white/10 !backdrop-blur-sm rounded-xl",
            "border border-white/10",
            "hover:border-accent/50 transition",
            // Allow custom classes to override if needed
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

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