import * as React from "react";
import { cn } from "@common/lib/utils";
import { Label as LabelPrimitive } from "@common/components/ui/label";

type LabelVariant = 'default' | 'secondary';
type LabelSize = 'sm' | 'md' | 'lg';

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive> {
    variant?: LabelVariant;
    size?: LabelSize;
    error?: boolean;
    required?: boolean;
    className?: string;
}

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive>,
    LabelProps
>(({
       className,
       variant = 'default',
       size = 'md',
       error,
       required,
       children,
       ...props
   }, ref) => {
    const variants: Record<LabelVariant, string> = {
        default: "text-foreground",
        secondary: "text-secondary"
    };

    const sizes: Record<LabelSize, string> = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    };

    return (
        <LabelPrimitive
            ref={ref}
            className={cn(
                "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                variants[variant],
                sizes[size],
                error && "text-error",
                className
            )}
            {...props}
        >
            {children}
            {required && (
                <span className="text-error ml-1" aria-hidden="true">
                    *
                </span>
            )}
        </LabelPrimitive>
    );
});

Label.displayName = "Label";

export default Label;