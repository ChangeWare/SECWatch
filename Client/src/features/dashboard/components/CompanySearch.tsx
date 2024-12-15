import React, {useState} from "react";
import {Search} from "lucide-react";

export default function CompanySearch() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10
                     text-gray-300 placeholder-gray-400 focus:outline-none focus:border-accent"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
}