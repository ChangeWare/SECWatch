import React from "react";
import {useNavigate} from "react-router-dom";

type ButtonVariant = 'primary' | 'secondary';

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
        primary: "bg-main-orange text-white hover:bg-main-orange-light",
        secondary: "border border-main-blue text-main-blue-light hover:bg-main-blue hover:text-white",
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