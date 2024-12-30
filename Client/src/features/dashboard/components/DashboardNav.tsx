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

interface DashboardNavProps {
    sidebarOpen: boolean;
    onSidebarToggle: () => void;
}

export default function DashboardNav(props: DashboardNavProps) {

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

                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                    <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search companies, filings, or alerts..."
                            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg
                     border border-white/10 text-gray-300 placeholder-gray-400
                     focus:outline-none focus:border-info transition"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition">
                        <Bell className="h-5 w-5 text-gray-300"/>
                    </button>
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
                            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/10">
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/10">
                                Preferences
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10"/>
                            <DropdownMenuItem onSelect={() => navigate(paths.auth.logout)} className="text-red-400 focus:text-red-400 focus:bg-white/10">
                                <LogOut className="mr-2 h-4 w-4"/> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}