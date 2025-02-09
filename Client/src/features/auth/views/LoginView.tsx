import { layoutStyles, textStyles} from "@common/styles/components.ts";
import {LoginForm} from "@features/auth/components/LoginForm.tsx";
import HyperLink from "@common/components/HyperLink.tsx";
import {Card} from "@common/components/Card.tsx";
import {useNavigate} from "react-router-dom";
import {paths} from "@routes/paths.ts";

export default function LoginView() {

    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate(paths.dashboard.default);
    }

    return (
        <div className="min-h-screen bg-background">
            <div className={`min-h-screen ${layoutStyles.flexCenter} py-8`}>
                <Card className={'w-full max-w-md p-8 m-4'}>
                    <div className="text-center mb-8">
                        <h1 className={textStyles.heading}>Welcome Back</h1>
                        <p className={textStyles.paragraph}>
                            Sign in to continue monitoring SEC filings
                        </p>
                    </div>

                    <LoginForm onLoginSuccess={handleLoginSuccess}/>

                    <div className="mt-6 text-center">
                        <p className={textStyles.paragraph}>
                            Don't have an account?{' '}

                            <HyperLink href="/register">Create one</HyperLink>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}