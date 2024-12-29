import CompanySearch from "@features/companySearch/components/CompanySearch.tsx";


export default function CompanySearchView() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <CompanySearch />
            </div>
        </div>
    );
}

