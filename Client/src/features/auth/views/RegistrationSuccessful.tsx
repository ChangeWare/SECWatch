import Button from "@common/components/Button.tsx";
import {Card} from "@common/components/Card.tsx";

export default function RegistrationSuccessful() {
    return (
        <div className="min-h-screen bg-background">
            <div className="min-h-screen flex items-center justify-center py-8">
                <Card className="w-full max-w-md p-8 m-4 bg-surface rounded-lg">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-semibold text-foreground">Registration Successful</h1>
                        <p className="text-info mt-4">You can now sign in to your account</p>
                    </div>

                    <div className="text-center">
                        <Button to="/login" className="mt-4 w-full">
                            Sign in
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}