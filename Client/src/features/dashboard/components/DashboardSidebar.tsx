import React, {useMemo, useState} from "react";
import {
    AlertCircle,
    Building2,
    ChevronRight,
    FileText,
    Home,
    LineChart, NotebookIcon,
    Settings,
    Lock
} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import { dashboardPaths } from "@features/dashboard";
import filingPaths from "@features/filings/paths.ts";
import alertPaths from "@features/alerts/paths.ts";
import {useAuth} from "@features/auth";
import HyperLink from "@common/components/HyperLink.tsx";
import {paths} from "@routes/paths.ts";

interface DashboardSidebarProps {
    sidebarOpen: boolean;
}

interface SideNavMenuItemData {
    label: string;
    href?: string;
    icon?: React.ElementType;
    isGroup?: boolean;
    isOpen?: boolean;
    setOpen?: (isOpen: boolean) => void;
    items?: SideNavMenuItemData[];
}

interface SideNavMenuItemProps {
    item: SideNavMenuItemData;
    index: number;
    sidebarOpen: boolean;
}

function SideNavMenuItem(props: SideNavMenuItemProps) {
    const location = useLocation();
    const { item, sidebarOpen } = props;

    const isActive = useMemo(() =>
            item.href &&
            location.pathname.includes(item.href),
        [location.pathname, item.href]);

    return (
        <div key={props.index}>
            {item.isGroup ? (
                <div className="space-y-1">
                    <button
                        onClick={() => item.setOpen?.(!item.isOpen)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg
                               text-gray-300 hover:text-white hover:bg-white/10 transition 
                               ${isActive ? 'bg-white/10 text-white' : ''}`}
                    >
                        <div className="flex items-center">
                            {item.icon && <item.icon className="h-5 w-5 mr-3"/>}
                            {sidebarOpen && <span>{item.label}</span>}
                        </div>
                        {sidebarOpen && (
                            <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                    item.isOpen ? 'rotate-90' : ''
                                }`}
                            />
                        )}
                    </button>
                    {sidebarOpen && item.isOpen && (
                        <div className="ml-9 space-y-1">
                            {item.items?.map((subItem, subIndex) => {
                                const subItemIsActive = subItem.href && location.pathname.includes(subItem.href);
                                return (
                                    <Link
                                        to={subItem.href!}
                                        key={subIndex}
                                        className={`block p-2 rounded-lg text-gray-400
                                         hover:text-white hover:bg-white/10 transition
                                         ${subItemIsActive ? 'bg-white/10 text-white' : ''}`}
                                    >
                                        {subItem.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    to={item.href!}
                    className={`w-full flex items-center p-2 rounded-lg text-gray-300 
                            hover:text-white hover:bg-white/10 transition 
                            ${isActive ? 'bg-white/10 text-white' : ''}`}
                >
                    <div className="flex items-center">
                        {item.icon && <item.icon className="h-5 w-5 mr-3"/>}
                        {sidebarOpen && <span>{item.label}</span>}
                    </div>
                </Link>
            )}
        </div>
    );
}

function AuthenticatedNavGroup({ children, sidebarOpen }: { children: React.ReactNode, sidebarOpen: boolean }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="relative">
                <div className="pointer-events-none opacity-75">
                    {children}
                </div>
                <div className="absolute inset-0 backdrop-blur-xs bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2 p-2">
                        <Lock className="h-4 w-4 text-white/70" />
                        {sidebarOpen && (
                            <p className="text-xs text-white/70 text-center">
                                <HyperLink to={paths.auth.login}>Sign in</HyperLink> or <HyperLink to={paths.auth.register}>register</HyperLink> to use these features
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
    const [companiesOpen, setCompaniesOpen] = useState(true);
    const [filingsOpen, setFilingsOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);
    const [alertsOpen, setAlertsOpen] = useState(false);

    // Navigation items with nested structure
    const publicNavItems: SideNavMenuItemData[] = [
        { icon: Home, label: 'Dashboard', href: '/dash' },
        {
            icon: Building2,
            label: 'Companies',
            isGroup: true,
            isOpen: companiesOpen,
            setOpen: setCompaniesOpen,
            href: dashboardPaths.company.default,
            items: [
                {label: 'Tracked Companies', href: dashboardPaths.company.tracked},
                {label: 'Company Search', href: dashboardPaths.company.search},
            ],
        },
    ];

    const authenticatedNavItems: SideNavMenuItemData[] = [

        {
            icon: NotebookIcon,
            label: 'Notes',
            href: '/notes',
            isGroup: true,
            isOpen: notesOpen,
            setOpen: setNotesOpen,
            items: [
                { label: 'Explore Notes', href: dashboardPaths.exploreNotes }
            ]
        },
        {
            icon: AlertCircle,
            label: 'Alerts',
            href: '#',
            isGroup: true,
            isOpen: alertsOpen,
            setOpen: setAlertsOpen,
            items: [
                { label: 'Alert Rules', href: alertPaths.rules },
            ],
        },
    ];

    return (
        <aside
            className={`${
                props.sidebarOpen ? 'w-64' : 'w-16'
            } border-r border-white/10 transition-all duration-300`}
        >
            <nav className="p-4 space-y-2">
                {/* Public nav items */}
                {publicNavItems.map((item, index) => (
                    <SideNavMenuItem
                        key={index}
                        item={item}
                        index={index}
                        sidebarOpen={props.sidebarOpen}
                    />
                ))}

                {/* Authenticated nav items wrapped in group */}
                <AuthenticatedNavGroup sidebarOpen={props.sidebarOpen}>
                    <div className="space-y-2">
                        {authenticatedNavItems.map((item, index) => (
                            <SideNavMenuItem
                                key={index + publicNavItems.length}
                                item={item}
                                index={index + publicNavItems.length}
                                sidebarOpen={props.sidebarOpen}
                            />
                        ))}
                    </div>
                </AuthenticatedNavGroup>
            </nav>
        </aside>
    );
}