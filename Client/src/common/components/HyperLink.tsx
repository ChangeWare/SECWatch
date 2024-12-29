import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface StyledLinkProps {
    children: React.ReactNode;
    href?: string;
    to?: string;
    className?: string;
    variant?: 'default' | 'subtle';
    external?: boolean;
}

const StyledLink: React.FC<StyledLinkProps> = ({
                                                   children,
                                                   href,
                                                   to,
                                                   className = '',
                                                   variant = 'default',
                                                   external = false,
                                                   ...props
                                               }) => {

    const baseStyles = "transition-colors duration-200";

    const variants = {
        default: "text-info hover:text-info/80",
        subtle: "text-secondary hover:text-info"
    };

    const styles = `${baseStyles} ${variants[variant]} ${className}`;

    if (external && href) {
        return (
            <a
                href={href}
                className={styles}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <a href={href} className={styles} {...props}>
                {children}
            </a>
        );
    }

    return (
        <RouterLink to={to || '/'} className={styles} {...props}>
            {children}
        </RouterLink>
    );
};

export default StyledLink;