import * as React from "react";
import { cn } from "@common/lib/utils";
import {
    Tabs as TabsPrimitive,
    TabsList as TabsListPrimitive,
    TabsTrigger as TabsTriggerPrimitive,
    TabsContent as TabsContentPrimitive,
} from "@common/components/ui/tabs";

const Tabs = TabsPrimitive;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsListPrimitive>,
    React.ComponentPropsWithoutRef<typeof TabsListPrimitive>
>(({ className, ...props }, ref) => (
    <TabsListPrimitive
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-lg bg-surface p-1",
            "border border-border",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsTriggerPrimitive>,
    React.ComponentPropsWithoutRef<typeof TabsTriggerPrimitive>
>(({ className, ...props }, ref) => (
    <TabsTriggerPrimitive
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-md px-3 py-1.5",
            "text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[state=active]:bg-surface-foreground data-[state=active]:text-foreground",
            "data-[state=inactive]:text-secondary hover:data-[state=inactive]:bg-surface-foreground/40",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsContentPrimitive>,
    React.ComponentPropsWithoutRef<typeof TabsContentPrimitive>
>(({ className, ...props }, ref) => (
    <TabsContentPrimitive
        ref={ref}
        className={cn(
            "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };