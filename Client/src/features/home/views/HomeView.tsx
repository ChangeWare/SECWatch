import {ArrowRight, BarChart2, Bell, Search} from "lucide-react";
import React from "react";
import FeatureCard from "../components/FeatureCard.tsx";
import Button from "@common/components/Button.tsx";
import { layoutStyles, textStyles } from "@common/styles/components.ts";
import {paths} from "@routes/paths.ts";
import {homePaths} from "@features/home";
import {useAuth} from "@features/auth";

function FeaturesSection() {
    const features = [
        {
            icon: <Search className="w-8 h-8 text-info"/>,
            title: "Advanced Search",
            description: "Search through millions of SEC filings with our powerful search engine."
        },
        {
            icon: <Bell className="w-8 h-8 text-info"/>,
            title: "Real-time Alerts",
            description: "Get instant notifications when new filings match your criteria."
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-info" />,
            title: "Analytics Dashboard",
            description: "Visualize filings trends and extract meaningful insights."
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-info" />,
            title: "AI Powered Analysis",
            description: "Leverage powerful AI models to extract valuable insights from filings"
        }
    ];

    return (
        <div className="py-24" id="features">
            <div className={layoutStyles.contentSection}>
                <h2 className={`${textStyles.heading} text-center mb-16`}>
                    Powerful Features for Corporate Intelligence
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

interface HeroSectionProps {
    isAuthenticated: boolean;
}

function HeroSection(props: HeroSectionProps) {
    return (
        <div className="relative overflow-hidden">
            <div className={layoutStyles.contentSection}>
                <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-6">
                        SECWatch
                        <h2 className="text-2xl md:text-4xl font-bold text-info pt-4">Empowering Public
                            Oversight</h2>
                    </div>

                    <p className={textStyles.subheading}>
                        Empowering unions, journalists, and progressives with real-time SEC alerts, powerful search capabilities,
                        AI-driven analytics, and insights from labor data and news streams.
                    </p>
                    <div className={layoutStyles.flexCenter}>
                        <Button className="px-8 py-3 text-lg flex items-center" to={paths.auth.register}>
                            {props.isAuthenticated ? "Go to Dashboard" : "Start Now" } <ArrowRight className="ml-2"/>
                        </Button>
                        <Button variant="info" className="px-8 py-3 text-lg ml-4" to={homePaths.about}>
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

interface CTASectionProps {
    isAuthenticated: boolean;
}

function CTASection(props: CTASectionProps) {
    return (
        <div className="py-16">
            <div className={layoutStyles.contentSection}>
                <div
                    className='bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between'>
                    <div className="mb-8 md:mb-0 md:mr-8">
                        <h2 className={textStyles.heading}>
                            Ready to get started?
                        </h2>
                        <p className={textStyles.paragraph}>
                            Join thousands of professionals who trust SECWatch for their market intelligence needs.
                        </p>
                    </div>
                    <Button className="px-8 py-3 text-lg whitespace-nowrap">
                        {props.isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default function HomeView() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <HeroSection isAuthenticated={isAuthenticated} />
            <FeaturesSection />
            <CTASection isAuthenticated={isAuthenticated} />
        </>
    );
}