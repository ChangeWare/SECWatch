import {Card, CardContent} from "@common/components/Card.tsx";
import Button from "@common/components/Button.tsx";
import {Info, Pin} from "lucide-react";
import {CompanyConcept} from "@features/company/types.ts";
import {
    formatConceptType
} from "@features/company/utils.tsx";
import {useMemo, useState} from "react";
import {cn} from "@common/lib/utils.ts";
import {toast} from "react-toastify";
import useCompanyDashboard from "@features/company/hooks/useCompanyDashboard.tsx";
import ConceptPreview from "@features/company/components/ConceptPreview.tsx";

interface ConceptCardProps {
    onDashboard: boolean;
    concept: CompanyConcept;
    onAddToDashboard: (concept: CompanyConcept) => void;
    onRemoveFromDashboard: (concept: CompanyConcept) => void;
}

function ConceptCard(props: ConceptCardProps) {
    const {
        concept
    } = props;

    const [showInfo, setShowInfo] = useState(false);

    const {} = useCompanyDashboard();


    const onInfoClick = () => {
        navigator.clipboard.writeText(concept.description).then(() => {
            toast.success('Description copied to clipboard');
        });
    }

    const handleAddToDashboardClick = () => {
        props.onAddToDashboard(concept);
    }

    const handleRemoveFromDashboardClick = () => {
        props.onRemoveFromDashboard(concept);
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

                <ConceptPreview concept={concept} />

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                    <Button variant="foreground" size="sm">View Details</Button>
                    {!props.onDashboard ? (
                            <Button onClick={handleAddToDashboardClick} variant="primary" size="sm">Add to Dashboard</Button>
                        ) : (
                            <Button onClick={handleRemoveFromDashboardClick} variant="danger" size="sm">Remove from Dashboard</Button>
                        )
                    }

                </div>
            </CardContent>
        </Card>
    );
}

export default ConceptCard;