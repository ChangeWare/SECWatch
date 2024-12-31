import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {Search} from "lucide-react";
import {useCompanySearch} from "@features/companySearch/hooks/useCompanySearch.tsx";
import {CompanyResult, SearchResponse} from "@features/companySearch/types.ts";
import {cn} from "@common/lib/utils.ts";
import { useNavigate } from "react-router-dom";

interface CompanySearchBarProps {
    onResultSelect: (result: CompanyResult) => void;
    onQueryComplete: (response: SearchResponse) => void;
}

export default function CompanySearchBar(props: CompanySearchBarProps) {

    const [ debouncedQuery, setDebouncedQuery ] = useState("");
    const { setQuery, response, isLoading } = useCompanySearch();
    const [isOpen, setIsOpen] = useState(false); // Controls dropdown visibility

    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(debouncedQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [debouncedQuery]);

    useEffect(() => {
        console.log(response);
        if (response?.companies.length > 0) {
            props.onQueryComplete(response);
        }
    }, [response]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDebouncedQuery(value);
        setIsOpen(value.length > 0); // Open dropdown only if input exists
    };

    const handleSelectResult = (result: CompanyResult) => {
        setDebouncedQuery(result.name);
        setIsOpen(false);

        props.onResultSelect(result);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsOpen(false);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={searchBarRef}>
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={debouncedQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search companies..."
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg
               border border-white/10
               text-gray-300 placeholder-gray-400
               focus:outline-none focus:border-info
               transition-colors" // Added transition for smooth effect
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"/>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div
                    className="absolute top-12 left-0 w-full bg-gray-800 border border-white/10 rounded-lg shadow-lg z-10">
                    {isLoading ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Loading...</div>
                    ) : response?.companies.length > 0 ? (
                        <ul className="max-h-48 overflow-y-auto">
                            {response.companies.map((result, index) => (
                                <li
                                    key={index}
                                    className={cn(
                                        "px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-all"
                                    )}
                                    onClick={() => handleSelectResult(result)}
                                >
                                    {result.name} ({result.ticker})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
}