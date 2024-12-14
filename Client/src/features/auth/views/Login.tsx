import {glassStyles, layoutStyles, textStyles} from "@common/styles/components.ts";
import {LoginForm} from "@features/auth/components/LoginForm.tsx";

export default function Login() {
    return (
        <div className="min-h-screen bg-background">
            <div className={`min-h-screen ${layoutStyles.flexCenter} py-8`}>
                <div className={`w-full max-w-md p-8 m-4 ${glassStyles.card}`}>
                    <div className="text-center mb-8">
                        <h1 className={textStyles.heading}>Welcome Back</h1>
                        <p className={textStyles.paragraph}>
                            Sign in to continue monitoring SEC filings
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 text-center">
                        <p className={textStyles.paragraph}>
                            Don't have an account?{' '}
                            <a href="/register" className="text-primary hover:text-accent">
                                Create one
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}