import CompanyContextBar from "./components/CompanyContextBar.tsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useCompany from "./hooks/useCompany.tsx";
import LoadingScreen from "@common/views/LoadingScreen.tsx";

export default function CompanyDashboardLayout() {
    const navigate = useNavigate();
    const { companyId } = useParams();

    const { company, isLoading } = useCompany(companyId);

    return (
        isLoading || !company ? (
            <LoadingScreen />
        ) : (
            <>
                <CompanyContextBar
                    companyName={company?.name}
                />
                <div className="p-6">
                    <Outlet />
                </div>
            </>
        )
    );
}
