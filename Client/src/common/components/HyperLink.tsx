import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '../lib/utils';

interface StyledLinkProps {
    children: React.ReactNode;
    href?: string;
    to?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'subtle';
    external?: boolean;
}

const StyledLink: React.FC<StyledLinkProps> = (props: StyledLinkProps) => {

    const {
        children,
        href,
        to,
        className = '',
        variant = 'default',
        external = false,
        onClick,
        ...rest
    } = props;

    const baseStyles = "transition-colors duration-200";

    const variants = {
        default: "text-info hover:text-info/80",
        subtle: "text-secondary hover:text-info"
    };

    const styles = cn(baseStyles, variants[variant], className);

    if (external && href) {
        return (
            <a
                href={href}
                className={styles}
                target="_blank"
                rel="noopener noreferrer"
                {...rest}
            >
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <a href={href} className={styles} {...rest}>
                {children}
            </a>
        );
    }

    if (onClick) {
        return (
            <a className={styles} onClick={onClick} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <RouterLink to={to || '/'} className={styles} {...rest}>
            {children}
        </RouterLink>
    );
};

export default StyledLink;