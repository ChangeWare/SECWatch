import React from "react";

export default function DashboardFooter() {
    return (
        <footer className="border-t border-white/10 py-4 px-6">
            <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>© 2025 SECWatch. All rights reserved.</span>
                <div className="space-x-4">
                    <a href="#" className="hover:text-white transition">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Contact Support
                    </a>
                </div>
            </div>
        </footer>
    );
}