import {cn} from "@common/lib/utils.ts";
import React from "react";

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "placeholder:text-secondary",
                className
            )}
            {...props}
        />
    );
});
Input.displayName = "Input";

export default Input;