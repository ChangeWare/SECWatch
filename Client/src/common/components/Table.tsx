import * as React from "react";
import { cn } from "@common/lib/utils";
import {
    Table as TablePrimitive,
    TableHeader as HeaderPrimitive,
    TableBody as BodyPrimitive,
    TableHead as HeadPrimitive,
    TableRow as RowPrimitive,
    TableCell as CellPrimitive,
} from "@common/components/ui/table";

export type TableVariant = 'default' | 'compact' | 'bordered';
export type TableColor = 'surface' | 'primary' | 'subtle';

export interface TableProps extends React.ComponentPropsWithoutRef<typeof TablePrimitive> {
    variant?: TableVariant;
    color?: TableColor;
}

const Table = React.forwardRef<
    React.ElementRef<typeof TablePrimitive>,
    TableProps
>(({ className, variant = 'default', color = 'surface', ...props }, ref) => {
    const baseStyles = "w-full border-collapse animate-in fade-in-50";

    const variants: Record<TableVariant, string> = {
        default: "text-sm",
        compact: "text-xs",
        bordered: "text-sm border border-border rounded-lg overflow-hidden"
    };

    const colors: Record<TableColor, string> = {
        surface: "bg-surface",
        primary: "bg-primary/5",
        subtle: "bg-surface-foreground/40"
    };

    return (
        <div className="relative w-full overflow-auto">
            <TablePrimitive
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    colors[color],
                    className
                )}
                {...props}
            />
        </div>
    );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef<
    React.ElementRef<typeof HeaderPrimitive>,
    React.ComponentPropsWithoutRef<typeof HeaderPrimitive>
>(({ className, ...props }, ref) => {
    const baseStyles = "bg-surface-foreground/30 border-b border-border";

    return (
        <HeaderPrimitive
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
    React.ElementRef<typeof BodyPrimitive>,
    React.ComponentPropsWithoutRef<typeof BodyPrimitive>
>(({ className, ...props }, ref) => {
    const baseStyles = "[&_tr:last-child]:border-0";

    return (
        <BodyPrimitive
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
    React.ElementRef<typeof RowPrimitive>,
    React.ComponentPropsWithoutRef<typeof RowPrimitive>
>(({ className, ...props }, ref) => {
    const baseStyles = "border-b border-border transition-colors hover:bg-surface-foreground/40 data-[state=selected]:bg-surface-foreground/60";

    return (
        <RowPrimitive
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
    React.ElementRef<typeof HeadPrimitive>,
    React.ComponentPropsWithoutRef<typeof HeadPrimitive>
>(({ className, ...props }, ref) => {
    const baseStyles = "h-12 px-4 text-left align-middle font-medium text-secondary [&:has([role=checkbox])]:pr-0";

    return (
        <HeadPrimitive
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
    React.ElementRef<typeof CellPrimitive>,
    React.ComponentPropsWithoutRef<typeof CellPrimitive>
>(({ className, ...props }, ref) => {
    const baseStyles = "p-4 align-middle [&:has([role=checkbox])]:pr-0";

    return (
        <CellPrimitive
            ref={ref}
            className={cn(baseStyles, className)}
            {...props}
        />
    );
});
TableCell.displayName = "TableCell";

const TableRowLoadingIndicator: React.FC<{
    children: React.ReactNode;
    loader: React.ReactNode;
    isLoading: boolean;
}> = ({ children, loader, isLoading }) => {
    return (
        isLoading ? (
            <TableRow>
                <TableCell colSpan={1000}>
                    {loader}
                </TableCell>
            </TableRow>
        ) : children
    )
};

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableRowLoadingIndicator
};