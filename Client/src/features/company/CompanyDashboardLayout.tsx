import CompanyContextBar from "./components/CompanyContextBar.tsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useCompany from "./hooks/useCompany.tsx";

export default function CompanyDashboardLayout() {
    const { companyId } = useParams();

    const { company } = useCompany(companyId);

    return (
        <>
            <CompanyContextBar
                companyName={company?.name}
            />
            <div className="p-6">
                <Outlet />
            </div>
        </>
    );
}
