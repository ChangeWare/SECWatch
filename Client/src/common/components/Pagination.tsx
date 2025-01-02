import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BasePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    visiblePages?: number;
    className?: string;
}

interface PaginationWithCount extends BasePaginationProps {
    showCount: true;
    totalItems: number;
    itemsPerPage: number;
}

interface PaginationWithoutCount extends BasePaginationProps {
    showCount?: false;
    totalItems?: never;
    itemsPerPage?: never;
}

type PaginationProps = PaginationWithCount | PaginationWithoutCount;

function Pagination({
                        currentPage,
                        totalPages,
                        onPageChange,
                        visiblePages = 5,
                        className = '',
                        showCount = false,
                        totalItems,
                        itemsPerPage
                    }: PaginationProps) {
    // Helper function to create a page button
    const PageButton = ({ page }: { page: number }) => (
        <button
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                currentPage === page
                    ? 'bg-info text-white'
                    : 'text-secondary hover:text-info hover:bg-surface'
            }`}
        >
            {page}
        </button>
    );

    // Calculate visible page range
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];

        // Always add first page
        pages.push(1);

        // Calculate range around current page
        let leftBound = Math.max(2, currentPage - Math.floor(visiblePages / 2));
        let rightBound = Math.min(totalPages - 1, leftBound + visiblePages - 2);

        // Adjust bounds to show more pages on either side if possible
        if (currentPage <= Math.floor(visiblePages / 2) + 1) {
            rightBound = Math.min(totalPages - 1, visiblePages);
            leftBound = 2;
        }
        if (currentPage > totalPages - Math.floor(visiblePages / 2) - 1) {
            leftBound = Math.max(2, totalPages - visiblePages + 1);
            rightBound = totalPages - 1;
        }

        // Add first ellipsis if needed
        if (leftBound > 2) {
            pages.push('...');
        }

        // Add pages around current page
        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }

        // Add last ellipsis if needed
        if (rightBound < totalPages - 1) {
            pages.push('...');
        }

        // Add last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    // Calculate items being shown
    const getItemCount = () => {
        if (!showCount || !totalItems || !itemsPerPage) return null;

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

        return {
            startItem,
            endItem,
            totalItems
        };
    };

    if (totalPages <= 1) return null;

    const itemCount = getItemCount();

    return (
        <div className={`flex items-center justify-between pt-4 mt-4 border-t border-border ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-secondary hover:text-info disabled:opacity-50 disabled:hover:text-secondary transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center">
                {itemCount && (
                    <span className="text-sm text-secondary mr-4">
                        {itemCount.startItem}-{itemCount.endItem} of {itemCount.totalItems}
                    </span>
                )}
                <div className="flex items-center gap-2">
                    {getVisiblePages().map((page, index) =>
                        typeof page === 'number' ? (
                            <PageButton key={page} page={page} />
                        ) : (
                            <span key={`ellipsis-${index}`} className="text-secondary px-1">
                                {page}
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-secondary hover:text-info disabled:opacity-50 disabled:hover:text-secondary transition-colors"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export default Pagination;