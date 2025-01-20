import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import { Search } from "lucide-react";
import { useCompanySearch } from "@features/companySearch/hooks/useCompanySearch.tsx";
import { CompanyResult, SearchResponse } from "@features/companySearch/types.ts";
import { cn } from "@common/lib/utils.ts";

interface CompanySearchBarProps {
    onResultSelect: (result: CompanyResult) => void;
    onQueryComplete: (response: SearchResponse) => void;
    onSearchStart?: () => void;
    className?: string;
    iconClassName?: string;
}

export default function CompanySearchBar(props: CompanySearchBarProps) {
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const { setQuery, response, isLoading } = useCompanySearch();
    const [isOpen, setIsOpen] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(debouncedQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [debouncedQuery, setQuery]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDebouncedQuery(value);
        setIsOpen(true);

        if (value.length === 0) {
            setQuery("");
            setIsOpen(false);
        }
    };

    // The parent can just use the response directly from a prop
    useEffect(() => {
        props.onQueryComplete(response);
    }, [response]);


    const handleSelectResult = (result: CompanyResult) => {
        setDebouncedQuery(result.name);
        setIsOpen(false);
        props.onResultSelect(result);
    };

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchBarRef}>
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={debouncedQuery}
                    onChange={handleInputChange}
                    placeholder="Search companies by name or ticker..."
                    className={cn("w-full pl-10 py-3 bg-surface/50 backdrop-blur-sm rounded-lg border border-border text-foreground placeholder-secondary focus:outline-none focus:border-info focus:ring-1 focus:ring-info transition-all", props.className)}
                />
                <Search className={cn("absolute left-3 top-3.5 h-5 w-5 text-secondary", props.iconClassName)}/>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-12 left-0 w-full bg-surface border border-border rounded-lg shadow-lg z-50 mt-1">
                    {isLoading ? (
                        <div className="px-4 py-3 text-secondary">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin h-4 w-4 border-2 border-info border-t-transparent rounded-full"/>
                                <span>Searching...</span>
                            </div>
                        </div>
                    ) : response?.companies && response.companies.length > 0 ? (
                        <ul className="max-h-64 overflow-y-auto divide-y divide-border">
                            {response.companies.map((result) => (
                                <li
                                    key={result.cik}
                                    className="px-4 py-3 hover:bg-surface-foreground cursor-pointer transition-colors"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-foreground font-medium">{result.name}</div>
                                            <div className="text-secondary text-sm">CIK: {result.cik}</div>
                                        </div>
                                        {result.ticker && (
                                            <div className="text-info font-mono">{result.ticker}</div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : debouncedQuery.length > 0 ? (
                        <div className="px-4 py-3 text-secondary">No companies found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}