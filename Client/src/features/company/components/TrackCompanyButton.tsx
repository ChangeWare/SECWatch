import Button from "@common/components/Button.tsx";
import {BellRing} from "lucide-react";


interface TrackCompanyButtonProps {
    onClick: () => void;
    companyTracked?: boolean;
    loading?: boolean;
}

function TrackCompanyButton(props: TrackCompanyButtonProps) {

    if (props.loading) {
        return (
            <Button size="sm" variant="foreground">
                <BellRing className="h-5 w-5 text-gray-200 animate-pulse" />
            </Button>
        );
    }

    const variant = props.companyTracked ? 'enabled' : 'foreground';

    return (
        <Button onClick={props.onClick} size="sm" variant={variant}>
            <BellRing />
        </Button>
    );
}

export default TrackCompanyButton;