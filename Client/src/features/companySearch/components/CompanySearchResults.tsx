import { Card, CardContent } from "@/common/components/Card";
import {CompanyResult} from "@features/companySearch/types.ts";
import {useRef, useState} from "react";
import Pagination from "@common/components/Pagination.tsx";
import { useEffect } from "react";

interface CompanySearchResultsProps {
    searchResults: CompanyResult[];
    onResultSelected: (result: CompanyResult) => void;
    itemsPerPage?: number;
}

function CompanySearchResults(props: CompanySearchResultsProps) {
    const { searchResults, onResultSelected, itemsPerPage = 5 } = props;
    const prevSearchResultsRef = useRef(searchResults);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = searchResults.slice(startIndex, endIndex);

    useEffect(() => {
        const prevResults = prevSearchResultsRef.current;
        const resultsChanged =
            prevResults.length !== searchResults.length ||
            prevResults.some((prev, i) => prev.cik !== searchResults[i].cik);

        if (resultsChanged) {
            setCurrentPage(1);
            prevSearchResultsRef.current = searchResults;
        }
    }, [searchResults]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        searchResults.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                        Search Results
                        <span className="ml-2 text-sm text-secondary font-normal">
                                {searchResults.length} companies found
                            </span>
                    </h2>
                    <div className="text-sm text-secondary">
                        Showing {startIndex + 1}-{Math.min(endIndex, searchResults.length)} of {searchResults.length}
                    </div>
                </div>

                <div className="grid gap-4">
                    {currentResults.map((result) => (
                        <Card
                            key={result.cik}
                            variant="subtle"
                            className="hover:border-info transition-colors cursor-pointer"
                            onClick={() => onResultSelected(result)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-medium text-foreground">
                                                {result.name}
                                            </h3>
                                            {result.ticker && (
                                                <span className="px-2 py-1 rounded bg-surface text-info text-sm font-mono">
                                                        {result.ticker}
                                                    </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-secondary">
                                                CIK: {result.cik}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onResultSelected(result);
                                            }}
                                            className="flex items-center gap-2 text-info hover:text-info/80 transition-colors px-4 py-2 rounded-lg hover:bg-surface"
                                        >
                                            <span>View Details</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        )
    )
}

export default CompanySearchResults;