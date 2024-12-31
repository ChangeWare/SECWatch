import CompanySearchBar from "@features/companySearch";
import {useNavigate} from "react-router-dom";
import {CompanyResult, SearchResponse} from "@features/companySearch/types.ts";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@common/components/Table.tsx";
import {useState} from "react";


export default function CompanySearchView() {

    const navigate = useNavigate();

    const [ searchResults, setSearchResults ] = useState<CompanyResult[]>([]);

    const onQueryComplete = (response: SearchResponse) => {
        setSearchResults(response.companies);
    }

    const onResultSelected = (company: CompanyResult) => {
        navigate(`/companies/${company.cik}`);
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <CompanySearchBar
                    onQueryComplete={onQueryComplete}
                    onResultSelect={onResultSelected} />

                { searchResults?.length > 0 && (
                    <Table className="mt-10">
                        <TableHeader>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell>CIK</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchResults.map((result) => (
                                <TableRow key={result.cik} onClick={() => onResultSelected(result)}>
                                    <TableCell>{result.name}</TableCell>
                                    <TableCell>{result.cik}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

