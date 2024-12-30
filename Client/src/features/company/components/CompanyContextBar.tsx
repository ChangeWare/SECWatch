import {ChevronLeft} from "lucide-react";
import {Link} from "react-router-dom";

interface CompanyContextBarProps {
    companyName: string;
}

export default function CompanyContextBar(props: CompanyContextBarProps) {
    const navItems = [
        { label: 'Overview', path: 'overview' },
        { label: 'Filings', path: 'filings' },
        { label: 'Analysis', path: 'analysis' },
        { label: 'Alerts', path: 'alerts' },
        { label: 'Documents', path: 'documents' }
    ];


    const isActive = (path: string) => {
        return location.pathname.endsWith(path) ||
            location.pathname.endsWith(`${path}/`);
    };

    return (
        <div className="top-16 z-30 border-b border-border bg-surface/50 backdrop-blur-sm">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center">
                <span className="text-lg font-semibold text-foreground">
                    {props.companyName}
                </span>
                </div>

                <nav className="flex space-x-12">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`relative py-1 text-sm font-medium transition-colors ${
                                isActive(item.path)
                                    ? 'text-foreground'
                                    : 'text-foreground/60 hover:text-foreground'
                            }`}
                        >
                            {item.label}
                            {isActive(item.path) && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-info rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}