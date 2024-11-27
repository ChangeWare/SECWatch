import HomeLayout from "@common/layouts/HomeLayout";
import {ArrowRight, BarChart2, Bell, Search} from "lucide-react";
import React from "react";
import FeatureCard from "../components/FeatureCard.tsx";
import Button from "@common/components/Button.tsx";
import {glassStyles, layoutStyles, textStyles} from "@common/styles/components.ts";

function FeaturesSection() {
    const features = [
        {
            icon: <Search className="w-8 h-8 text-main-orange-light"/>,
            title: "Advanced Search",
            description: "Search through millions of SEC filings with our powerful search engine."
        },
        {
            icon: <Bell className="w-8 h-8 text-main-orange-light"/>,
            title: "Real-time Alerts",
            description: "Get instant notifications when new filings match your criteria."
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-main-orange-light" />,
            title: "Analytics Dashboard",
            description: "Visualize filing trends and extract meaningful insights."
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-main-orange-light" />,
            title: "AI Powered Analysis",
            description: "Leverage powerful AI models to extract valuable insights from filings"
        }
    ];

    return (
        <div className="py-24" id="features">
            <div className={layoutStyles.contentSection}>
                <h2 className={`${textStyles.heading} text-center mb-16`}>
                    Powerful Features for Market Intelligence
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function HeroSection() {
    return (
        <div className="relative overflow-hidden">
            <div className={layoutStyles.contentSection}>
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Monitor SEC Filings <br/>
                        <span className="text-main-orange-light">Like Never Before</span>
                    </h1>
                    <p className={textStyles.subheading}>
                        Stay ahead of the market with real-time SEC filing alerts, advanced analytics, and powerful
                        search capabilities.
                    </p>
                    <div className={layoutStyles.flexCenter}>
                        <Button className="px-8 py-3 text-lg flex items-center">
                            Start Free Trial <ArrowRight className="ml-2"/>
                        </Button>
                        <Button variant="secondary" className="px-8 py-3 text-lg ml-4">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

function CTASection() {
    return (
        <div className="py-16">
            <div className={layoutStyles.contentSection}>
                <div
                    className={`${glassStyles.container} p-8 md:p-12 flex flex-col md:flex-row items-center justify-between`}>
                    <div className="mb-8 md:mb-0 md:mr-8">
                        <h2 className={textStyles.heading}>
                            Ready to get started?
                        </h2>
                        <p className={textStyles.paragraph}>
                            Join thousands of professionals who trust SECWatch for their market intelligence needs.
                        </p>
                    </div>
                    <Button className="px-8 py-3 text-lg whitespace-nowrap">
                        Start Free Trial
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default function HomeView() {
    return (
        <>
            <HeroSection/>
            <FeaturesSection/>
            <CTASection/>
        </>
    );
}