import React from "react";
import {useNavigate} from "react-router-dom";

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
    className?: string;
    to?: string;
}

function Button({
                    variant = 'primary',
                    to,
                    className = '',
                    children,
                    ...props
                }: ButtonProps) {

    const navigate = useNavigate();

    const baseStyles = "px-6 py-2 rounded-lg transition";
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-info text-info-foreground hover:opacity-90",
        success: "bg-success text-success-foreground hover:opacity-90",
        danger: "bg-error text-error-foreground hover:opacity-90"
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
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;