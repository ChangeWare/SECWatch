import {glassStyles, layoutStyles, textStyles} from "@common/styles/components.ts";
import {RegistrationForm} from "@features/auth/components/RegistrationForm.tsx";

export default function Register() {
    return (
        <div className="min-h-screen bg-main-blue-dark">
            <div className={`min-h-screen ${layoutStyles.flexCenter} py-8`}>
                <div className={`w-full max-w-md p-8 m-4 ${glassStyles.card}`}>
                    <div className="text-center mb-8">
                        <h1 className={textStyles.heading}>Join SECWatch</h1>
                        <p className={textStyles.paragraph}>
                            Start monitoring SEC filings and get real-time alerts
                        </p>
                    </div>

                    <RegistrationForm/>

                    <div className="mt-6 text-center">
                        <p className={textStyles.paragraph}>
                            Already have an account?{' '}
                            <a href="/login" className="text-main-orange-light hover:text-main-orange">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}