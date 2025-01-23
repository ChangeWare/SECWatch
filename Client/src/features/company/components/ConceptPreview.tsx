import {cn} from "@common/lib/utils.ts";
import {
    formatCurrency,
    getChangeOverPriorYear,
    getChangePercentClassName,
    getPercentChangeOverPriorYear
} from "@features/company/utils.tsx";
import {CompanyConcept} from "@features/company/types.ts";
import {useMemo} from "react";

interface ConceptPreviewProps {
    concept: CompanyConcept;
    header?: string;
}

function ConceptPreview(props: ConceptPreviewProps) {

    const {
        concept,
        header
    } = props;

    const formattedValue = useMemo(() => {
        if (concept.isCurrencyData) {
            return formatCurrency(concept.lastValue);
        }

        return concept.lastValue.toLocaleString();
    }, [concept]);

    const changeOverPriorYear = useMemo(() => {
        return getChangeOverPriorYear(concept.dataPoints);
    }, [concept]);

    const percentageChangeOverPriorYear = useMemo(() => {
        return getPercentChangeOverPriorYear(concept.dataPoints);
    }, [concept]);

    const formattedChangeValue = useMemo(() => {

        let value = changeOverPriorYear;

        if (value == 0) return 'No change over prior year';

        if (value > 0) {
            return `↑ ${concept.isCurrencyData ? formatCurrency(value) : value.toLocaleString()} from prior year`;
        } else {
            value = Math.abs(value);
            return `↓ ${concept.isCurrencyData ? formatCurrency(value) : value.toLocaleString()}  from prior year`;
        }

    }, [changeOverPriorYear]);

    return (
        <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <div className="text-sm text-secondary">{header ? header : "Current Value"}</div>
            <div className="text-lg font-medium mt-1 text-foreground">{formattedValue}</div>
            <div
                className={cn("text-sm mt-1", getChangePercentClassName(percentageChangeOverPriorYear))}>{formattedChangeValue}</div>
        </div>
    );
}

export default ConceptPreview;