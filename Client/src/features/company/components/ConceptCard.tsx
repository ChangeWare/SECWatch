import {Card, CardContent} from "@common/components/Card.tsx";
import Button from "@common/components/Button.tsx";
import {Info, Pin} from "lucide-react";
import {CompanyConcept} from "@features/company/types.ts";
import {
    formatConceptType,
    formatCurrency,
    getChangeOverPriorYear, getChangePercentClassName,
    getPercentChangeOverPriorYear
} from "@features/company/utils.tsx";
import {useMemo, useState} from "react";
import {cn} from "@common/lib/utils.ts";
import {toast} from "react-toastify";

interface ConceptCardProps {
    concept: CompanyConcept;
}

function ConceptCard(props: ConceptCardProps) {
    const {
        concept
    } = props;

    const [showInfo, setShowInfo] = useState(false);

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

    const onInfoClick = () => {
        navigator.clipboard.writeText(concept.description).then(() => {
            toast.success('Description copied to clipboard');
        });
    }

    return (
        <Card variant="elevated">
            <CardContent className="p-6">
                <div className="flex flex-row items-center gap-2">
                    <h3 className="font-medium text-foreground">{formatConceptType(concept.conceptType)}</h3>
                    <div
                        className="relative "
                    >
                        <Info
                            onMouseEnter={() => setShowInfo(true)}
                            onMouseLeave={() => setShowInfo(false)}
                            onClick={onInfoClick}
                            className="h-4 w-4"
                        />

                        <p
                            className={cn(
                                "text-sm w-64 text-secondary absolute top-full left-0 mt-2 p-2 bg-surface rounded-lg border border-border shadow-lg",
                                showInfo ? "block" : "hidden"
                            )}
                        >
                            {concept.description}
                        </p>
                    </div>
                </div>

                {/* Metric Preview */}
                <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
                    <div className="text-sm text-secondary">Current Value</div>
                    <div className="text-lg font-medium mt-1 text-foreground">{formattedValue}</div>
                    <div className={cn("text-sm mt-1", getChangePercentClassName(percentageChangeOverPriorYear))}>{formattedChangeValue}</div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                    <Button variant="foreground" size="sm">View Details</Button>
                    <Button variant="primary" size="sm">Add to Dashboard</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ConceptCard;