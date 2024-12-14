import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 
                   hover:border-accent/50 transition ${className}`}>
        {children}
    </div>
);

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => (
    <h3 className={`text-xl font-semibold text-white ${className}`}>
        {children}
    </h3>
);

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);
