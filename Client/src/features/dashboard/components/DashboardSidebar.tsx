import React, {useMemo, useState} from "react";
import {
    AlertCircle,
    Building2,
    ChevronRight,
    FileText,
    Home,
    LineChart,
    Settings,
} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import {dashboardPaths} from "@features/dashboard";

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

    const isActive = useMemo(() =>
        props.item.href &&
        location.pathname.includes(props.item.href),
    [location.pathname, props.item.href]);

    return (
        <div key={props.index}>
            {props.item.isGroup ? (
                <div className="space-y-1">
                    <button
                        onClick={() => props.item.setOpen?.(!props.item.isOpen)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg
                               text-gray-300 hover:text-white hover:bg-white/10 transition 
                               ${isActive ? 'bg-white/10 text-white' : ''}`}
                    >
                        <div className="flex items-center">
                            {props.item.icon && <props.item.icon className="h-5 w-5 mr-3"/>}
                            {props.sidebarOpen && <span>{props.item.label}</span>}
                        </div>
                        {props.sidebarOpen && (
                            <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                    props.item.isOpen ? 'rotate-90' : ''
                                }`}
                            />
                        )}
                    </button>
                    {props.sidebarOpen && props.item.isOpen && (
                        <div className="ml-9 space-y-1">
                            {props.item.items?.map((subItem, subIndex) => {
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
                <Link to={props.item.href!}
                      className={`w-full flex items-center p-2 rounded-lg text-gray-300 
                            hover:text-white hover:bg-white/10 transition 
                            ${isActive ? 'bg-white/10 text-white' : ''}`}
                >
                    <div className="flex items-center">
                        {props.item.icon && <props.item.icon className="h-5 w-5 mr-3"/>}
                        {props.sidebarOpen && <span>{props.item.label}</span>}
                    </div>
                </Link>
            )}
        </div>
    );
}


export default function DashboardSidebar(props: DashboardSidebarProps) {
    const [companiesOpen, setCompaniesOpen] = useState(true);
    const [filingsOpen, setFilingsOpen] = useState(false);

    // Navigation items with nested structure
    const navItems: SideNavMenuItemData[] = [
        { icon: Home, label: 'Dashboard', href: '/dash'},
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
        {
            icon: FileText,
            label: 'Filings',
            isGroup: true,
            isOpen: filingsOpen,
            setOpen: setFilingsOpen,
            items: [
                {label: 'Recent Filings', href: '#'},
                {label: 'Filing Alerts', href: '#'},
                {label: 'Analysis', href: '#'},
            ],
        },
        {icon: LineChart, label: 'Analytics', href: '#'},
        {icon: AlertCircle, label: 'Alerts', href: '#'},
        {icon: Settings, label: 'Settings', href: '#'},
    ];

    return (
        <aside
            className={`${
                props.sidebarOpen ? 'w-64' : 'w-16'
            } border-r border-white/10 transition-all duration-300`}
        >
            <nav className="p-4 space-y-2">
                {navItems.map((item, index) => (
                    <SideNavMenuItem
                        key={index}
                        item={item}
                        index={index}
                        sidebarOpen={props.sidebarOpen}
                    />
                ))}
            </nav>
        </aside>
    );
}