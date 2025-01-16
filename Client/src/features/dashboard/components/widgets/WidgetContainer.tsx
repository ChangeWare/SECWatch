import React, {useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@common/components/Card.tsx";
import {ChevronDown, ChevronRight, Settings} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@common/components/DropdownMenu.tsx";

interface ConfigMenuItem {
    label: string;
    onClick: () => void;
    onConfigure?: () => void;
    configureMenu?: ConfigMenuItem[];
}

interface WidgetContainerProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    onConfigure?: () => void;  // Simple click handler
    configureMenu?: ConfigMenuItem[];  // Dropdown menu items
    widgetLoading?: boolean;
}

function WidgetContainer(props: WidgetContainerProps) {

    const {
        title,
        children,
        defaultExpanded = true,
        onConfigure,
        configureMenu,
        widgetLoading
    } = props;

    useEffect(() => {
        console.log(widgetLoading);
    }, [widgetLoading]);

    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const handleConfigClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfigure?.();
    };


    return (
        <Card>
            <CardHeader
                className={`flex flex-row items-center justify-between`}
            >
                <CardTitle className="text-xl text-white">{title}</CardTitle>
                <div className="flex items-center gap-2">
                    {/* Configuration options */}
                    {(onConfigure || configureMenu) && (
                        configureMenu ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Settings className="h-5 w-5 text-gray-400 hover:text-info transition-colors cursor-pointer"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {configureMenu.map((item, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onClick();
                                            }}
                                        >
                                            {item.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button disabled={widgetLoading}>
                                <Settings
                                    aria-disabled={widgetLoading}
                                    className="h-5 w-5 text-gray-400 hover:text-info transition-colors cursor-pointer"
                                    onClick={handleConfigClick}
                                />
                            </button>
                        )
                    )}
                    <button className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-400"/>
                        ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400"/>
                        )}
                    </button>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent>
                    {children}
                </CardContent>
            )}
        </Card>
    );
}

export default WidgetContainer;