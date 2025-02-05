import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@common/components/Card";
import Button from "@common/components/Button";
import StyledLink from "@common/components/HyperLink";
import { Shield, Users, Scale, Brain } from "lucide-react";
import { layoutStyles, textStyles } from "@common/styles/components";
import { paths } from "@routes/paths";

function MissionSection() {
    return (
        <div className={layoutStyles.contentSection}>
            <h1 className={`${textStyles.heading} text-center mb-8`}>
                About SECWatch
            </h1>
            <div className="max-w-3xl mx-auto mb-16">
                <p className={`${textStyles.paragraph} text-center mb-6`}>
                    SECWatch is a pioneering platform that democratizes access to corporate intelligence through advanced SEC filing analysis. We empower journalists, unions, and public interest researchers with real-time insights and AI-powered analytics.
                </p>
            </div>
        </div>
    );
}

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
            title: "Innovation",
            description: "Leveraging AI and advanced analytics to uncover meaningful insights."
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

function ContactSection() {
    return (
        <div className="py-16">
            <div className={layoutStyles.contentSection}>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`${textStyles.paragraph} mb-6`}>
                            Have questions about SECWatch? We'd love to hear from you. Reach out to our team or join our community.
                        </p>
                        <div className="flex flex-col justify-between sm:flex-row gap-4">
                            <Button variant="primary" to={"#contact"}>
                                Contact Us
                            </Button>

                            <Button variant="primary" to={paths.auth.register}>
                                Get Started Today
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AboutView() {
    return (
        <>
            <MissionSection />
            <ValuesSection />
            <ContactSection />
        </>
    );
}