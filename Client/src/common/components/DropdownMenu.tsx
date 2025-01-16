import * as React from "react";
import { cn } from "@common/lib/utils";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu as DropdownMenuPrimitive,
    DropdownMenuTrigger as DropdownMenuTriggerPrimitive,
    DropdownMenuContent as DropdownMenuContentPrimitive,
    DropdownMenuItem as DropdownMenuItemPrimitive,
    DropdownMenuCheckboxItem as DropdownMenuCheckboxItemPrimitive,
    DropdownMenuRadioItem as DropdownMenuRadioItemPrimitive,
    DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
    DropdownMenuGroup as DropdownMenuGroupPrimitive,
    DropdownMenuPortal as DropdownMenuPortalPrimitive,
    DropdownMenuSub as DropdownMenuSubPrimitive,
    DropdownMenuSubContent as DropdownMenuSubContentPrimitive,
    DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive,
    DropdownMenuRadioGroup as DropdownMenuRadioGroupPrimitive,

} from "@common/components/ui/dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive;
const DropdownMenuTrigger = DropdownMenuTriggerPrimitive;
const DropdownMenuGroup = DropdownMenuGroupPrimitive;
const DropdownMenuPortal = DropdownMenuPortalPrimitive;
const DropdownMenuSub = DropdownMenuSubPrimitive;
const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitive;

const DropdownMenuContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuContentPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPortalPrimitive>
        <DropdownMenuContentPrimitive
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border",
                "bg-surface p-1 shadow-lg",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </DropdownMenuPortalPrimitive>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuItemPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitive> & {
    inset?: boolean;
}
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5",
            "text-sm text-foreground outline-none transition-colors",
            "focus:bg-surface-foreground focus:text-foreground",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuCheckboxItemPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItemPrimitive>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuCheckboxItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2",
            "text-sm text-foreground outline-none transition-colors",
            "focus:bg-surface-foreground focus:text-foreground",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <RadixDropdownMenu.ItemIndicator>
                <Check className="h-4 w-4" />
            </RadixDropdownMenu.ItemIndicator>
        </span>
        {children}
    </DropdownMenuCheckboxItemPrimitive>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuRadioItemPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItemPrimitive>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuRadioItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2",
            "text-sm text-foreground outline-none transition-colors",
            "focus:bg-surface-foreground focus:text-foreground",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <RadixDropdownMenu.ItemIndicator>
                <Circle className="h-2 w-2 fill-current" />
            </RadixDropdownMenu.ItemIndicator>
        </span>
        {children}
    </DropdownMenuRadioItemPrimitive>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuSubContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuSubContentPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuSubContentPrimitive>
>(({ className, ...props }, ref) => (
    <DropdownMenuSubContentPrimitive
        ref={ref}
        className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border",
            "bg-surface p-1 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuSubTrigger = React.forwardRef<
React.ElementRef<typeof DropdownMenuSubTriggerPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuSubTriggerPrimitive> & {
    inset?: boolean;
}
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuSubTriggerPrimitive
        ref={ref}
        className={cn(
            "flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5",
            "text-sm text-foreground outline-none transition-colors",
            "focus:bg-surface-foreground data-[state=open]:bg-surface-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuSubTriggerPrimitive>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSeparator = React.forwardRef<
React.ElementRef<typeof DropdownMenuSeparatorPrimitive>,
React.ComponentPropsWithoutRef<typeof DropdownMenuSeparatorPrimitive>
>(({ className, ...props }, ref) => (
    <DropdownMenuSeparatorPrimitive
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-border", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};