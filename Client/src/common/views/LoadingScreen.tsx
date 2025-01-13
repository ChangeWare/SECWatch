import LoadingIndicator from "@common/components/LoadingIndicator.tsx";

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-background">
            <LoadingIndicator isLoading={true}>
                <></>
            </LoadingIndicator>
        </div>
    );
}

export default LoadingScreen;