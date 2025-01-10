import {CompanyFiling} from "@features/company/types.ts";
import {useNavigate} from "react-router-dom";
import FilingsTable from "@features/filings/components/FilingsTable.tsx";


interface CompanyFilingsTableProps {
    cik?: string;
    filings?: CompanyFiling[];
    isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

function CompanyFilingsTable (props: CompanyFilingsTableProps){
    const {
        filings = [],
        isLoading = false,
        cik
    } = props;

    const navigate = useNavigate();

    const handleOpenFiling = (filing: CompanyFiling) => {
        const { accessionNumber } = filing;

        const path = `${accessionNumber}`;
        navigate(path, {
            replace: true,
            relative: "route"
        });
    }

    return (
        <FilingsTable
            filings={filings}
            isLoading={isLoading}
            onOpenFiling={handleOpenFiling}
            cik={cik}
            itemsPerPage={ITEMS_PER_PAGE}
        />
    );
};

export default CompanyFilingsTable;