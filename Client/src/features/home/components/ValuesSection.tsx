import {Brain, Scale, Shield, Users} from "lucide-react";
import {layoutStyles, textStyles} from "@common/styles/components.ts";
import React from "react";
import {Card} from "@common/components/Card.tsx";

interface ValueCardProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
    return (
        <Card variant="subtle" className="flex flex-col items-center text-center p-6">
            <Icon className="w-12 h-12 text-info mb-4" />
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-secondary">{description}</p>
        </Card>
    );
}

function ValuesSection() {
    const values = [
        {
            icon: Shield,
            title: "Transparency",
            description: "Making corporate information accessible and understandable to everyone."
        },
        {
            icon: Users,
            title: "Empowerment",
            description: "Providing tools that level the playing field for public interest research."
        },
        {
            icon: Scale,
            title: "Accountability",
            description: "Supporting oversight and responsible corporate behavior through data."
        },
        {
            icon: Brain,
            title: "Open Source",
            description: "Building a community-driven platform that is open and transparent."
        }
    ];

    return (
        <div className="py-16 bg-surface/30">
            <div className={layoutStyles.contentSection}>
                <h2 className={`${textStyles.heading} text-center mb-12`}>Our Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <ValueCard key={index} {...value} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ValuesSection;