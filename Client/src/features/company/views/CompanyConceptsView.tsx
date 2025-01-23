import React, { useState, useMemo, useEffect} from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@common/components/Card';
import Button from '@common/components/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@common/components/Tabs';
import Input from '@common/components/Input';
import ConceptCard from "@features/company/components/ConceptCard.tsx";
import useCompanyConcepts from "@features/company/hooks/useCompanyConcepts.ts";
import {CompanyConcept} from "@features/company/types.ts";
import {useParams} from "react-router-dom";
import useCompanyDashboard from "@features/company/hooks/useCompanyDashboard.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import useAllCompanyConcepts from "@features/company/hooks/useAllCompanyConcepts.tsx";

const CompanyConceptsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('key_metrics');

    const { companyId } = useParams();

    const { concepts } = useAllCompanyConcepts(companyId);

    const {
        addConceptToDashboard,
        dashboardPreferences,
        dashboardPreferencesIsLoading,
        removeConceptFromDashboard
    } = useCompanyDashboard(companyId);

    const categories = [
        { id: 'key_metrics', label: 'Key Metrics' },
        { id: 'labor_and_employment', label: 'Labor & Employment' },
        { id: 'operations', label: 'Operations' },
        { id: 'financial', label: 'Financial' },
        { id: 'legal_and_compliance', label: 'Legal & Compliance' }
    ];

    // Filter concepts based on search term
    const filteredConcepts = useMemo(() => {
        if (!searchTerm) return concepts;

        const searchLower = searchTerm.toLowerCase();
        return concepts.filter(concept =>
            concept.conceptType.toLowerCase().includes(searchLower) ||
            concept.description.toLowerCase().includes(searchLower)
        );
    }, [searchTerm, concepts]);

    // Group filtered concepts by category
    const groupedConcepts = useMemo(() => {
        const groups = categories.reduce((acc, category) => {
            acc[category.id] = [];
            return acc;
        }, {} as Record<string, CompanyConcept[]>);

        filteredConcepts.forEach(concept => {
            if (groups[concept.category]) {
                groups[concept.category].push(concept);
            }
        });

        return groups;
    }, [filteredConcepts]);

    useEffect(() => {
        if (searchTerm) {
            const currentTabHasMatches = groupedConcepts[activeTab]?.length > 0;
            if (!currentTabHasMatches) {
                const firstTabWithMatches = categories.find(category => groupedConcepts[category.id]?.length > 0);
                if (firstTabWithMatches) {
                    setActiveTab(firstTabWithMatches.id);
                }
            }
        }
    }, [searchTerm, groupedConcepts, activeTab, categories]);

    // Count total matches
    const totalMatches = filteredConcepts.length;

    // Handle search input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleAddToDashboard = (concept: CompanyConcept) => {
        addConceptToDashboard(concept.conceptType);
    }

    const handleRemoveFromDashboard = (concept: CompanyConcept) => {
        removeConceptFromDashboard(concept.conceptType);
    }

    return (
        <div className="space-y-6">
            {/* Categories and Concepts */}
            <Card>
                <CardHeader>
                    <div className="flex-col">
                        <CardTitle>Metrics</CardTitle>
                        <p className="text-sm text-secondary mt-2">
                            Explore and analyze company metrics and data points
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary"/>
                                <Input
                                    placeholder="Search concepts..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            {searchTerm && (
                                <div className="text-sm text-secondary">
                                    {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <LoadingIndicator isLoading={!concepts || dashboardPreferencesIsLoading}>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full justify-start mb-6">
                                {categories.map(category => (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        disabled={searchTerm !== '' && groupedConcepts[category.id].length === 0}
                                    >
                                        {category.label}
                                        {searchTerm && groupedConcepts[category.id].length > 0 && (
                                            <span className="ml-2 text-xs bg-surface-foreground px-2 py-0.5 rounded-full">
                                            {groupedConcepts[category.id].length}
                                        </span>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {categories.map(category => (
                                <TabsContent key={category.id} value={category.id}>
                                    {groupedConcepts[category.id].length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groupedConcepts[category.id].map(concept => (
                                                <ConceptCard
                                                    concept={concept}
                                                    key={concept.cik + concept.conceptType}
                                                    onAddToDashboard={handleAddToDashboard}
                                                    onRemoveFromDashboard={handleRemoveFromDashboard}
                                                    onDashboard={dashboardPreferences!.pinnedConcepts.includes(concept.conceptType)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        searchTerm && (
                                            <div className="text-center py-8 text-secondary">
                                                No matching concepts in this category
                                            </div>
                                        )
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </LoadingIndicator>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyConceptsView;