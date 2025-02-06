import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableRowLoadingIndicator
} from "@common/components/Table.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import {
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    PaginationState, SortingState,
    useReactTable
} from "@tanstack/react-table";
import Pagination from "@common/components/Pagination.tsx";
import React, {useState} from "react";
import {Search} from "lucide-react";
import {rankItem} from "@tanstack/match-sorter-utils";
import {CompanyFiling} from "@features/filings/types.ts";

export interface FilingsTableProps {
    cik?: string;
    filings?: CompanyFiling[];
    itemsPerPage?: number;
    onOpenFiling?: (filing: CompanyFiling) => void;
    isLoading: boolean;
}

function FilingsTable(props: FilingsTableProps) {
    const {
        cik,
        filings = [],
        itemsPerPage = 10,
        onOpenFiling,
        isLoading
    } = props;

    const fuzzyFilter: FilterFn<CompanyFiling> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });
        return itemRank.passed;
    };

    const columnHelper = createColumnHelper<CompanyFiling>();

    const [sorting, setSorting] = useState<SortingState>([
        { id: 'filingDate', desc: true }
    ]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: itemsPerPage,
    });

    const columns = [
        columnHelper.accessor('form', {
            header: 'Form',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('filingDate', {
            header: 'Filing Date',
            cell: info => new Date(info.row.original.filingDate).toLocaleDateString(),
            sortingFn: 'datetime'
        }),
        columnHelper.accessor('reportDate', {
            header: 'Report Date',
            cell: info => new Date(info.row.original.filingDate).toLocaleDateString() || 'N/A',
        }),
        columnHelper.accessor('items', {
            header: 'Items',
            cell: info => info.getValue() || 'N/A',
        }),
    ];

    const table = useReactTable({
        data: filings,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const totalFilteredItems = table.getFilteredRowModel().rows.length;
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        table.setPageIndex(newPage - 1); // Convert 1-based to 0-based index
    };

    const handleOpenFiling = (filing: CompanyFiling) => {
        onOpenFiling?.(filing);
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary"/>
                <input
                    type="text"
                    placeholder="Search filings..."
                    className="h-10 w-full rounded-lg bg-surface/80 border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <Table variant="bordered" color="surface">
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead
                                    key={header.id}
                                    className={header.column.getCanSort() ? 'cursor-pointer hover:text-primary' : ''}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className="flex items-center gap-2">
                                            {header.column.columnDef.header as string}
                                            {header.column.getIsSorted() && (
                                                <span>
                                                    {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    <LoadingIndicator isLoading={isLoading} ContainerComponent={TableRowLoadingIndicator}>
                        {table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                className={`
                                    border-b border-white/10 hover:bg-white/5
                                    ${row.getIsGrouped() ? 'bg-surface-foreground/20' : ''}
                                `}
                                onClick={() => handleOpenFiling(row.original)}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className="p-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {table.getRowModel().rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-tertiary py-8"
                                >
                                    No filings found
                                </TableCell>
                            </TableRow>
                        )}
                    </LoadingIndicator>
                </TableBody>
            </Table>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <Pagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showCount={true}
                    totalItems={totalFilteredItems}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </div>
    )
}

export default FilingsTable;