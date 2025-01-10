import React, {PropsWithChildren, useState} from 'react';
import DashboardNav from './components/DashboardNav';
import DashboardFooter from "@features/dashboard/components/DashboardFooter.tsx";
import DashboardSidebar from "@features/dashboard/components/DashboardSidebar.tsx";
import {Outlet} from "react-router-dom";

const DashboardLayout = ({ children } : PropsWithChildren) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background min-w-fit">
            <DashboardNav sidebarOpen={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex">
                <DashboardSidebar sidebarOpen={isSidebarOpen} />
                <main className="flex-1 min-h-screen">
                    <div className="p-6"><Outlet /></div>
                </main>
            </div>
            <DashboardFooter/>
        </div>
    );
};

export default DashboardLayout;