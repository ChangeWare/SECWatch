import React from "react";
import { textStyles} from "@common/styles/components.ts";
import {Card} from "@common/components/Card.tsx";


interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = (props: FeatureCardProps) => (
    <Card className='p-6'>
        <div className="bg-info/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
            {props.icon}
        </div>
        <h3 className={textStyles.heading}>{props.title}</h3>
        <p className={textStyles.paragraph}>{props.description}</p>
    </Card>
);

export default FeatureCard;