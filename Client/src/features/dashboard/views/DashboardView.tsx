import AlertStream from "../components/AlertStream/AlertStream.tsx";
import React from "react";
import PinnedChartsWidget from "@features/dashboard/components/widgets/PinnedChartsWidget.tsx";
import RecentFilingsWidget from "@features/dashboard/components/widgets/RecentFilingsWidget.tsx";

// Main Dashboard Component
function DashboardView() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <RecentFilingsWidget />
                        <PinnedChartsWidget />
                    </div>

                    <div className="lg:col-span-1">
                        <AlertStream />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardView;