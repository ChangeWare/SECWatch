import CompanySearchBar from "@features/companySearch";
import {CompanyResult, SearchResponse} from "@features/companySearch/types.ts";

function GlobalSearchBar() {

    const handleResultSelect = (result: CompanyResult) => {

    }

    const handleQueryComplete = (query: SearchResponse) => {
        return;
    }

    return (
        <CompanySearchBar
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg
                     border border-white/10 text-gray-300 placeholder-gray-400
                     focus:outline-none focus:border-info transition"
            onResultSelect={handleResultSelect}
            onQueryComplete={handleQueryComplete}
            iconClassName="top-3"
        />
    );
}

export default GlobalSearchBar;