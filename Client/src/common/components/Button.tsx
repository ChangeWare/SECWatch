import React from "react";

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           className = '',
                                           children,
                                           ...props
                                       }) => {
    const baseStyles = "px-6 py-2 rounded-lg transition";
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-main-orange text-white hover:bg-main-orange-light",
        secondary: "border border-main-blue text-main-blue-light hover:bg-main-blue hover:text-white",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;