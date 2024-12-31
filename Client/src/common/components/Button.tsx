import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@common/lib/utils";

export type ButtonVariant = 'primary' | 'info' | 'success' | 'danger' | 'foreground';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    className?: string;
    to?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                     variant = 'primary',
                                                                     size = 'md',
                                                                     to,
                                                                     className = '',
                                                                     children,
                                                                     ...props
                                                                 }, ref) => {
    const navigate = useNavigate();

    const baseStyles = "inline-flex items-center justify-center rounded-lg transition";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        foreground: "bg-foreground/5 hover:bg-foreground/10 border-foreground/10",
        info: "bg-info text-info-foreground hover:opacity-90",
        success: "bg-success text-success-foreground hover:opacity-90",
        danger: "bg-error text-error-foreground hover:opacity-90"
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2",
        lg: "px-8 py-3 text-lg",
        icon: "p-2 h-10 w-10"
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (to) {
            event.preventDefault();
            navigate(to);
        }
        if (props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <button
            ref={ref}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                "disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;