import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@common/components/ui/dialog.tsx";
import {ChevronRight, ChevronDown, TableIcon, DownloadIcon} from 'lucide-react';
import { CompanyConcept, ConceptDataPoint } from "@features/company/types.ts";
import {
    convertConceptDataPointsToCSV, downloadCSV,
    formatConceptType,
    getInvertedChangePercentClassName
} from "@features/company/utils.tsx";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    useReactTable,
    createColumnHelper,
    SortingState,
    GroupingState,
    ExpandedState,
} from '@tanstack/react-table';
import Button from "@common/components/Button.tsx";

interface CompanyConceptDataTableModalProps {
    concept: CompanyConcept;
    formatValue: (value: number) => string;
    initialFocusDate?: Date;
    isOpen: boolean;
    onClose: () => void;
}

const columnHelper = createColumnHelper<ConceptDataPoint>();

function CompanyConceptDataTableModal (props: CompanyConceptDataTableModalProps) {

    const { concept, formatValue, initialFocusDate, isOpen, onClose} = props;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [grouping] = useState<GroupingState>(['fiscalYear']);
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const tableRef = useRef<HTMLDivElement>(null);

    const handleDownloadData = () => {
        const csvData = convertConceptDataPointsToCSV(concept.dataPoints);
        downloadCSV(csvData, `${concept.conceptType}-${concept.lastUpdated.toLocaleDateString()}-data.csv`);
    }

    useEffect(() => {
        if (initialFocusDate && concept.dataPoints) {
            // Find the fiscal year for the focus date
            const focusPoint = concept.dataPoints.find(point => {
                const pointDate = new Date(point.endDate);
                return pointDate.getTime() === initialFocusDate.getTime();
            });

            if (focusPoint) {
                // Expand the fiscal year group
                setExpanded({
                    [`${focusPoint.fiscalYear}`]: true
                });

                // Schedule scroll after render
                setTimeout(() => {
                    const rowElement = document.querySelector(
                        `[data-row-id="${focusPoint.fiscalYear}-${focusPoint.fiscalPeriod}"]`
                    );
                    if (rowElement && tableRef.current) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }
    }, [initialFocusDate, concept]);


    // Map fiscal year to its FY period data
    const yearEndDataMap = useMemo(() => {
        const map = new Map<number, ConceptDataPoint>();
        concept.dataPoints.forEach(point => {
            if (point.fiscalPeriod === 'FY') {
                map.set(point.fiscalYear, point);
            }
        });
        return map;
    }, [concept]);

    // Pre-calculate previous year values for performance
    const previousYearValues = useMemo(() => {
        return new Map(
            concept.dataPoints.map(point => [
                `${point.fiscalYear}-${point.fiscalPeriod}`,
                concept.dataPoints.find(p =>
                    p.fiscalYear === point.fiscalYear - 1 &&
                    p.fiscalPeriod === point.fiscalPeriod
                )?.value
            ])
        );
    }, [concept.dataPoints]);

    const columns = [
        columnHelper.accessor('fiscalYear', {
            header: 'Fiscal Year',
            cell: info => {
                if (info.row.getIsGrouped()) {
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={info.row.getToggleExpandedHandler()}
                                className="flex items-center gap-1"
                            >
                                {info.row.getIsExpanded() ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                <span>FY {info.getValue()}</span>
                            </button>
                        </div>
                    );
                }
                return info.getValue();
            },
        }),
        columnHelper.accessor('fiscalPeriod', {
            header: 'Period',
            cell: info => {
                if (info.row.getIsGrouped()) {
                    return 'FY';
                }
                return info.getValue();
            },
        }),
        columnHelper.accessor('endDate', {
            header: 'End Date',
            cell: info => {
                if (info.row.getIsGrouped()) {
                    const fyData = yearEndDataMap.get(info.row.original.fiscalYear);
                    return fyData?.endDate.toLocaleDateString() ?? '-';
                }
                return info.getValue().toLocaleDateString();
            },
        }),
        columnHelper.accessor('value', {
            header: 'Amount',
            cell: info => {
                if (info.row.getIsGrouped()) {
                    const fyData = yearEndDataMap.get(info.row.original.fiscalYear);
                    return fyData ? formatValue(fyData.value) : '-';
                }
                return formatValue(info.getValue());
            },
        }),
        columnHelper.accessor(
            row => {
                const prevValue = previousYearValues.get(`${row.fiscalYear}-${row.fiscalPeriod}`);
                return prevValue ? row.value - prevValue : 0;
            },
            {
                id: 'yoyChange',
                header: 'YoY Change',
                cell: info => {
                    if (info.row.getIsGrouped()) {
                        const fyData = yearEndDataMap.get(info.row.original.fiscalYear);
                        if (!fyData) return '-';
                        const prevValue = previousYearValues.get(`${fyData.fiscalYear}-FY`);
                        const value = prevValue ? fyData.value - prevValue : 0;
                        return (
                            <div className={getInvertedChangePercentClassName(value)}>
                                {(value === 0) ? 'NA' : formatValue(value)}
                            </div>
                        );
                    }
                    const value = info.getValue();
                    return (
                        <div className={getInvertedChangePercentClassName(value)}>
                            {(value === 0) ? 'NA' : formatValue(value)}
                        </div>
                    );
                },
            }
        ),
        columnHelper.accessor(
            row => {
                const prevValue = previousYearValues.get(`${row.fiscalYear}-${row.fiscalPeriod}`);
                return prevValue ? ((row.value - prevValue) / prevValue) * 100 : 0;
            },
            {
                id: 'yoyChangePercent',
                header: 'YoY Change %',
                cell: info => {
                    if (info.row.getIsGrouped()) {
                        const fyData = yearEndDataMap.get(info.row.original.fiscalYear);
                        if (!fyData) return '-';
                        const prevValue = previousYearValues.get(`${fyData.fiscalYear}-FY`);
                        const value = prevValue ? ((fyData.value - prevValue) / prevValue) * 100 : 0;
                        return (
                            <div className={getInvertedChangePercentClassName(value)}>
                                {(value === 0) ? 'NA' : value.toFixed(2) + "%"}
                            </div>
                        );
                    }
                    const value = info.getValue();
                    return (
                        <div className={getInvertedChangePercentClassName(value)}>
                            {(value === 0) ? 'NA' : value.toFixed(2) + "%"}
                        </div>
                    );
                },
            }
        ),
        columnHelper.accessor('formType', {
            header: 'Source',
            cell: info => {
                if (info.row.getIsGrouped()) {
                    const fyData = yearEndDataMap.get(info.row.original.fiscalYear);
                    return fyData?.formType ?? '-';
                }
                return info.getValue();
            },
        }),
    ];

    const table = useReactTable({
        data: concept.dataPoints,
        columns,
        state: {
            sorting,
            grouping,
            expanded,
        },
        onSortingChange: setSorting,
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        autoResetPageIndex: false,
        enableGrouping: true,
        enableExpanding: true,
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl h-[80vh] bg-background border border-white/10">
                <DialogHeader className="mt-8">
                    <div className="flex justify-between">
                        <DialogTitle className="text-lg font-bold text-foreground">
                            Historical Data - {formatConceptType(concept.conceptType)}
                        </DialogTitle>
                        <Button variant="foreground" size="sm" onClick={handleDownloadData}>
                            <DownloadIcon className="h-4 w-4 mr-2"/>
                            Download
                        </Button>
                    </div>

                </DialogHeader>
                <div ref={tableRef} className="mt-4 h-[calc(80vh-6rem)] overflow-y-auto relative">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-background z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-white/10">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="h-12 px-4 text-left align-middle font-medium text-primary-light bg-background"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className={`
                                        border-b border-white/10 hover:bg-white/5
                                        ${row.getIsGrouped() ? 'bg-surface-foreground/20' : ''}
                                    `}
                                data-row-id={`${row.original?.fiscalYear}-${row.original?.fiscalPeriod}`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CompanyConceptDataTableModal;