import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {Star, Plus, Search, Building2, X} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableRowLoadingIndicator
} from '@common/components/Table';
import Button from '@common/components/Button';
import CompanySearchBar from '@features/companySearch';
import { CompanyResult, SearchResponse } from '@features/companySearch/types';
import Pagination from '@common/components/Pagination';
import useTrackedCompanies from "@features/company/hooks/useTrackedCompanies.ts";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import useCompanyTracking from "@features/company/hooks/useCompanyTracking.ts";

const TrackedCompaniesView = () => {
    const navigate = useNavigate();
    const [isAddingCompany, setIsAddingCompany] = useState(false);
    const [searchResults, setSearchResults] = useState<CompanyResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { trackedCompanies } = useTrackedCompanies();
    const { trackCompany, untrackCompany } = useCompanyTracking();

    const onSearchComplete = useCallback((response: SearchResponse) => {
        setSearchResults(response.companies);
        setIsSearching(false);
    }, []);

    const onCompanySelect = (company: CompanyResult) => {
        // Handle adding company to tracked list
        setIsAddingCompany(false);
        setSearchResults([]);

        trackCompany(company.cik);
    };

    const navigateToCompany = (cik: string) => {
        navigate(`/companies/${cik}`);
    };

    const handleUntrackCompany = (cik: string) => {
        untrackCompany(cik);
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tracked Companies</h1>
                        <p className="text-secondary mt-2">
                            Monitor and analyze your tracked companies
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setIsAddingCompany(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Company
                    </Button>
                </div>

                {/* Search Section - Only visible when adding company */}
                {isAddingCompany && (
                    <Card variant="elevated" className="mb-8">
                        <CardHeader>
                            <CardTitle>Search Companies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CompanySearchBar
                                onQueryComplete={onSearchComplete}
                                onResultSelect={onCompanySelect}
                                onSearchStart={() => setIsSearching(true)}
                            />

                            {/* Search Results */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin h-6 w-6 border-3 border-info border-t-transparent rounded-full"/>
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="mt-4">
                                    <Table variant="compact">
                                        <TableBody>
                                            {searchResults.map((company) => (
                                                <TableRow
                                                    key={company.cik}
                                                    className="cursor-pointer"
                                                    onClick={() => onCompanySelect(company)}
                                                >
                                                    <TableCell>{company.name}</TableCell>
                                                    <TableCell className="text-right">{company.ticker}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* No Companies State */}
                {trackedCompanies?.length === 0 ? (
                    <Card variant="subtle" className="text-center py-12">
                        <Building2 className="mx-auto h-12 w-12 text-secondary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Companies Tracked</h3>
                        <p className="text-secondary text-sm mb-6">
                            Start tracking companies to monitor their filings and performance
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddingCompany(true)}
                            className="flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add First Company
                        </Button>
                    </Card>
                ) : (
                    /* Companies Table */
                    <Card variant="elevated">
                        <CardContent className="p-4">
                            <Table variant="bordered" color="surface">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Ticker</TableHead>
                                        <TableHead>Last Event</TableHead>
                                        <TableHead>New Filings</TableHead>
                                        <TableHead>Date Added</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <LoadingIndicator isLoading={!trackedCompanies} ContainerComponent={TableRowLoadingIndicator}>
                                        {trackedCompanies && trackedCompanies!
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((tc) => (
                                                <TableRow key={tc.company.cik}>
                                                    <TableCell className="font-medium">{tc.company.name}</TableCell>
                                                    <TableCell>{tc.company.ticker}</TableCell>
                                                    <TableCell>{tc.lastEvent.toLocaleDateString()}</TableCell>
                                                    <TableCell>{tc.newFilings}</TableCell>
                                                    <TableCell>{tc.dateAdded.toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="foreground"
                                                                size="icon"
                                                                onClick={() => navigateToCompany(tc.company.cik)}
                                                                title={`View ${tc.company.name}`}
                                                            >
                                                                <Search className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                className="opacity-90"
                                                                variant="danger"
                                                                size="icon"
                                                                title={`Untrack ${tc.company.name}`}
                                                                onClick={() => handleUntrackCompany(tc.company.cik)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </LoadingIndicator>
                                </TableBody>
                            </Table>

                            {trackedCompanies && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(trackedCompanies!.length / itemsPerPage)}
                                    onPageChange={setCurrentPage}
                                    showCount
                                    totalItems={trackedCompanies!.length}
                                    itemsPerPage={itemsPerPage}
                                    className="px-6"
                                />
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
};

export default TrackedCompaniesView;