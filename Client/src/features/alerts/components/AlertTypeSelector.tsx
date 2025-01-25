import {Card, CardContent} from "@/common/components/Card";
import {Check, FileIcon} from "lucide-react";
import {cn} from "@common/lib/utils.ts";
import {ReactNode} from "react";
import {AlertRuleTypes} from "@features/alerts/types.ts";

interface AlertType {
    id: string;
    name: string;
    description: string;
    icon: ReactNode;
}

interface AlertTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

function AlertTypeSelector (props: AlertTypeSelectorProps) {

    const { value, onChange } = props;

    const alertTypes: AlertType[] = [
        {
            id: AlertRuleTypes.Filing,
            name: 'Filing Alert',
            description: 'Get notified when new filings are submitted by a company',
            icon: <FileIcon size={24} />
        }
    ];

    return (
        <div className="grid gap-4">
            {alertTypes.map((type) => (
                <Card
                    key={type.id}
                    variant={value === type.id ? 'elevated' : 'subtle'}
                    className={cn(
                        'cursor-pointer transition-all',
                        value === type.id ? 'border-success' : 'hover:border-info/50'
                    )}
                    onClick={() => onChange(type.id)}
                >
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className={cn(
                            'p-2 rounded-lg',
                            value === type.id ? 'bg-success/20' : 'bg-surface-foreground'
                        )}>
                            {type.icon}
                        </div>
                        <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-sm text-secondary">{type.description}</p>
                        </div>
                        {value === type.id && (
                            <Check className="h-5 w-5 text-success ml-auto" />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default AlertTypeSelector;