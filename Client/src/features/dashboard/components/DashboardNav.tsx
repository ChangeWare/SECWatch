import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Search,
    User,
    X
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@common/components/ui/dropdown-menu.tsx";
import React from "react";
import {Logo} from "@common/components/Logo.tsx";
import {useNavigate} from "react-router-dom";
import {paths} from "@routes/paths.ts";
import GlobalSearchBar from "@features/dashboard/components/GlobalSearchBar.tsx";
import {useAuth} from "@features/auth";
import Button from "@common/components/Button.tsx";

interface DashboardNavProps {
    sidebarOpen: boolean;
    onSidebarToggle: () => void;
}

export default function DashboardNav(props: DashboardNavProps) {

    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    return (
        <header className="border-b border-white/10">
            <div className="px-4 flex h-16 items-center justify-between">
                <div className="flex items-center space-x-1">
                    <button
                        onClick={props.onSidebarToggle}
                        className={`p-2 rounded-lg transition ${props.sidebarOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        <Menu className="h-5 w-5 text-gray-300"/>
                    </button>
                    <Logo height={40} className="hover:transform hover:scale-105 transition"/>

                </div>


                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition">
                                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="h-5 w-5 text-white"/>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-300"/>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white/10 backdrop-blur-sm border-white/10">
                                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10"/>
                                <DropdownMenuItem onSelect={() => navigate(paths.auth.logout)} className="text-red-400 focus:text-red-400 focus:bg-white/10">
                                    <LogOut className="mr-2 h-4 w-4"/> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={() => navigate(paths.auth.login)} variant="primary">Sign In</Button>
                    )}
                </div>
            </div>
        </header>
    );
}