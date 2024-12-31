import LoadingIndicator from "@common/components/LoadingIndicator.tsx";

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-background">
            <LoadingIndicator/>
        </div>
    );
}

export default LoadingScreen;