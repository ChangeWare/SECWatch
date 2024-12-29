import { layoutStyles, textStyles} from "@common/styles/components.ts";
import {RegistrationForm} from "@features/auth/components/RegistrationForm.tsx";
import HyperLink from "@common/components/HyperLink.tsx";
import {Card} from "@common/components/Card.tsx";

export default function Register() {
    return (
        <div className="min-h-screen bg-background">
            <div className={`min-h-screen ${layoutStyles.flexCenter} py-8`}>
                <Card className={'w-full max-w-md p-8 m-4'}>
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

                            <HyperLink href="/login">Sign in</HyperLink>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}