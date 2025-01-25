import React, { useState, useRef, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { useCompanySearch } from "@features/companySearch/hooks/useCompanySearch";
import { CompanyResult } from "@features/companySearch/types";
import { cn } from "@common/lib/utils";

interface CompanySearchInputProps {
    onSelect: (company: CompanyResult) => void;
    selectedCompany?: CompanyResult;
    className?: string;
}

const CompanySearchInput: React.FC<CompanySearchInputProps> = ({
                                                                   onSelect,
                                                                   selectedCompany,
                                                                   className
                                                               }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selectedCompany?.name || "");
    const { setQuery, response, isLoading } = useCompanySearch();
    const inputRef = useRef<HTMLDivElement>(null);

    // Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle input changes with debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue && inputValue !== selectedCompany?.name) {
                setQuery(inputValue);
                setIsOpen(true);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [inputValue, setQuery, selectedCompany]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length === 0) {
            setQuery("");
            setIsOpen(false);
        }
    };

    const handleSelectCompany = (company: CompanyResult) => {
        setInputValue(company.name);
        setIsOpen(false);
        onSelect(company);
    };

    return (
        <div className="relative" ref={inputRef}>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.length > 0 && setIsOpen(true)}
                    placeholder="Search companies by name or ticker..."
                    className={cn(
                        "w-full pl-10 py-3 bg-surface/50 backdrop-blur-sm rounded-lg",
                        "border border-border text-foreground placeholder-secondary",
                        "focus:outline-none focus:border-info focus:ring-1 focus:ring-info",
                        "transition-all",
                        className
                    )}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-secondary" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface border border-border rounded-lg shadow-lg z-50 mt-1">
                    {isLoading ? (
                        <div className="px-4 py-3 text-secondary">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-info border-t-transparent rounded-full" />
                                <span>Searching...</span>
                            </div>
                        </div>
                    ) : response?.companies && response.companies.length > 0 ? (
                        <ul className="max-h-64 overflow-y-auto divide-y divide-border">
                            {response.companies.map((company) => (
                                <li
                                    key={company.cik}
                                    onClick={() => handleSelectCompany(company)}
                                    className={cn(
                                        "px-4 py-3 cursor-pointer transition-colors",
                                        "hover:bg-surface-foreground",
                                        selectedCompany?.cik === company.cik && "bg-surface-foreground"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-foreground font-medium">
                                                {company.name}
                                            </div>
                                            <div className="text-secondary text-sm">
                                                CIK: {company.cik}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {company.ticker && (
                                                <span className="text-info font-mono">
                          {company.ticker}
                        </span>
                                            )}
                                            {selectedCompany?.cik === company.cik && (
                                                <Check className="h-4 w-4 text-success" />
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : inputValue.length > 0 ? (
                        <div className="px-4 py-3 text-secondary">
                            No companies found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CompanySearchInput;