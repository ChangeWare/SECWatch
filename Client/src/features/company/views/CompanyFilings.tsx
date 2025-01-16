import {useParams} from "react-router-dom";
import CompanyFilingsTable from "@features/company/components/CompanyFilingsTable.tsx";
import {Card, CardContent} from "@common/components/Card.tsx";
import useCompanyFilings from "@features/filings/hooks/useCompanyFilings.ts";
import {CompanyFilingHistory} from "@features/filings/types.ts";

interface CompanyFilingsContentProps {
    filingHistory?: CompanyFilingHistory;
    isLoading: boolean;
}
function CompanyFilingsContent({ filingHistory, isLoading }: CompanyFilingsContentProps) {
    return (
        <CompanyFilingsTable
            filings={filingHistory?.filings}
            isLoading={isLoading}
            cik={filingHistory?.cik}/>
    );
}

export function CompanyFilings() {
    const { companyId } = useParams();

    const { filingHistory, filingHistoryLoading } = useCompanyFilings(companyId);

    return (
        <div className="space-y-8">
            <Card variant="elevated" className="pt-4">
                <CardContent>
                    <CompanyFilingsContent
                        filingHistory={filingHistory}
                        isLoading={filingHistoryLoading || !filingHistory}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CompanyFilings;