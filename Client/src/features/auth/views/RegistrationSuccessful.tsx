
export default function RegistrationSuccessful() {
    return (
        <div className="min-h-screen bg-main-blue-dark">
            <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-md p-8 m-4 bg-white/5 rounded-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-semibold text-white">Registration Successful</h1>
                        <p className="text-main-blue-light">You can now log in to your account</p>
                    </div>

                    <div className="mt-6 text-center">
                        <a href="/login" className="block w-full p-3 rounded-lg bg-main-orange text-white hover:bg-main-orange-dark">
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}