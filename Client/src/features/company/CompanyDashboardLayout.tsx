import CompanyContextBar from "./components/CompanyContextBar.tsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useCompany from "./hooks/useCompany.tsx";

export default function CompanyDashboardLayout() {
    const { companyId } = useParams();

    const { company } = useCompany(companyId);

    return (
        <div className="flex flex-col w-full">
            <CompanyContextBar
                companyName={company?.name}
            />
            <div className="w-full max-w-[100vw] overflow-x-hidden pt-4">
                <div className="container mx-auto">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}
