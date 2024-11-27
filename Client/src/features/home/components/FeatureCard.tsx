import React from "react";
import {glassStyles, textStyles} from "@common/styles/components.ts";


interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = (props: FeatureCardProps) => (
    <div className={`${glassStyles.card} p-6`}>
        <div className="bg-main-orange-light/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
            {props.icon}
        </div>
        <h3 className={textStyles.heading}>{props.title}</h3>
        <p className={textStyles.paragraph}>{props.description}</p>
    </div>
);

export default FeatureCard;