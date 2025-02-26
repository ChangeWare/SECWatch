import React from "react";
import { ArrowRight, Search, Bell, BarChart2, TrendingUp, FileText, Zap } from "lucide-react";
import Button from "@common/components/Button.tsx";
import { Card, CardContent } from "@common/components/Card.tsx";
import { layoutStyles, textStyles } from "@common/styles/components.ts";
import { paths } from "@routes/paths.ts";
import { homePaths } from "@features/home";
import ValuesSection from "@features/home/components/ValuesSection.tsx";
import {Logo} from "@common/components/Logo.tsx";

function HeroSection() {
    return (
        <div className="relative overflow-hidden py-20 lg:py-32">
            <div className={layoutStyles.contentSection}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                            <Logo width={300} height={100} />
                            <span className="block text-2xl lg:text-3xl text-info">
                                Empowering Corporate Transparency
                            </span>
                        </h1>
                        <p className="text-xl text-secondary mb-8">
                            Empowering unions, journalists, and progressives with real-time SEC alerts, powerful search capabilities,
                            note-taking tools, no-strings-attached CSV downloads of financial data, and more than 20 years of historical data from the Security and Exchange Commission.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="px-8 py-3 text-lg flex items-center" to={paths.dashboard.default}>
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="info" className="px-8 py-3 text-lg" to={homePaths.contact}>
                                Contact Us
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
                            <img
                                src="/images/dash.png"
                                alt="Dashboard Preview"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface FeatureHighlightProps {
    title: string;
    description: string;
    imageUrl: string;
    reverse?: boolean;
}

function FeatureHighlight({ title, description, imageUrl, reverse = false }: FeatureHighlightProps) {
    return (
        <div className="py-2">
            <div className={layoutStyles.contentSection}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={reverse ? 'lg:pl-12' : 'lg:pr-12'}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">{title}</h2>
                        <p className="text-xl text-secondary mb-8">{description}</p>
                        <Button variant="info" className="px-6 py-2">
                            Learn More
                        </Button>
                    </div>
                    <div className="relative">
                        <Card className="overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full rounded-xl"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CTASection() {
    return (
        <div className="py-20">
            <div className={layoutStyles.contentSection}>
                <Card className="bg-surface/50 backdrop-blur-sm border-info/20">
                    <CardContent className="p-12">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                Start Uncovering Insights Today
                            </h2>
                            <p className="text-xl text-secondary mb-8">
                                Join leading organizations using SECWatch to stay ahead of corporate America.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button className="px-8 py-3 text-lg">
                                    Get Started
                                </Button>
                                <Button variant="info" to={paths.home.contact} className="px-8 py-3 text-lg">
                                    Schedule Demo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function HomeView() {
    return (
        <div className="min-h-screen">
            <HeroSection />

            <ValuesSection />

            <FeatureHighlight
                title="Search Thousands of Entities"
                description="SECWatch has parsed over XXX entities and their filings, making it easy to search and analyze any company."
                imageUrl="/images/search-entities.png"
            />

            <FeatureHighlight
                title="Data Visualization"
                description="Visualize dozens of available financial and operations data metrics with interactive dashboards and charts."
                imageUrl="/images/data-visuals.png"
                reverse
            />

            <FeatureHighlight
                title="Note Taking & Alerts"
                description="SECWatch lets you set alerts for specific filings, emailing a daily digest for your convenience.
                Additionally, you are empowered with a cloud-based note-taking toolto keep track of your research, allowing you to create notes and directly within our filing viewer."
                imageUrl="/images/notes.png"
            />

            <CTASection />
        </div>
    );
}