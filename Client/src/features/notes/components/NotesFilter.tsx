import React from 'react';
import { Filter as FilterIcon, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@common/components/DropdownMenu';
import Button from '@common/components/Button';
import ScrollArea from '@common/components/ScrollArea';

export interface FilterOption {
    id: string;
    label: string;
    value: string | number;
    category: string;
}

interface FilterProps {
    options: FilterOption[];
    selectedFilters: FilterOption[];
    onFilterChange: (filters: FilterOption[]) => void;
    categories: string[];
}

function NotesFilter (props: FilterProps) {
    const { options, selectedFilters, onFilterChange, categories } = props;
    const handleToggleFilter = (option: FilterOption) => {
        const isSelected = selectedFilters.some(filter =>
            filter.id === option.id && filter.category === option.category
        );

        if (isSelected) {
            onFilterChange(selectedFilters.filter(filter =>
                !(filter.id === option.id && filter.category === option.category)
            ));
        } else {
            onFilterChange([...selectedFilters, option]);
        }
    };

    const removeFilter = (optionToRemove: FilterOption) => {
        onFilterChange(selectedFilters.filter(filter =>
            !(filter.id === optionToRemove.id && filter.category === optionToRemove.category)
        ));
    };

    const clearAllFilters = () => {
        onFilterChange([]);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <FilterIcon className="h-4 w-4" />
                            Filters
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                        {categories.map(category => (
                            <div key={category} className="px-2 py-1.5">
                                <div className="text-sm font-medium mb-1">{category}</div>
                                <ScrollArea className="h-15">
                                    {options
                                        .filter(option => option.category === category)
                                        .map(option => {
                                            const isSelected = selectedFilters.some(
                                                filter => filter.id === option.id && filter.category === option.category
                                            );
                                            return (
                                                <DropdownMenuItem
                                                    key={option.id}
                                                    className="flex items-center gap-2"
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        handleToggleFilter(option);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        className="rounded border-border"
                                                        onChange={() => {}}
                                                    />
                                                    <span>{option.label}</span>
                                                </DropdownMenuItem>
                                            );
                                        })}
                                </ScrollArea>
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {selectedFilters.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-tertiary hover:text-foreground"
                    >
                        Clear all
                    </Button>
                )}
            </div>

            {/* Active Filters */}
            {selectedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedFilters.map((filter) => (
                        <div
                            key={`${filter.category}-${filter.id}`}
                            className="flex items-center gap-1 px-2 py-1 bg-surface rounded-md text-sm"
                        >
                            <span>{filter.label}</span>
                            <button
                                onClick={() => removeFilter(filter)}
                                className="ml-1 text-tertiary hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesFilter;