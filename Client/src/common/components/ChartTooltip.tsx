import {Card, CardContent} from "@common/components/Card.tsx";
import React from "react";

interface ChartTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

function ChartTooltip (props: ChartTooltipProps) {
    if (!props.active || !props.payload || !props.payload.length) return null;

    return (
        <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-3">
                <p className="text-sm font-medium">{props.label}</p>
                <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(props.payload[0].value)}
                </p>
            </CardContent>
        </Card>
    );
};

export default ChartTooltip;