import { useAuth} from "@features/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {paths} from "@routes/paths.ts";

export default function Logout() {
    const { logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        logout();
        setTimeout(() => {
            navigate(paths.home.default);
        }, 3000);
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center p-8 bg-white/5 rounded-lg">
                <h1 className="text-3xl font-semibold text-white">You have been logged out</h1>
                <p className="text-accent">Beaming you home...</p>
            </div>
        </div>
    );
}