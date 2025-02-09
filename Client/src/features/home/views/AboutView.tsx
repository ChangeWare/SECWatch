import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@common/components/Card";
import Button from "@common/components/Button";
import StyledLink from "@common/components/HyperLink";
import { Shield, Users, Scale, Brain } from "lucide-react";
import { layoutStyles, textStyles } from "@common/styles/components";
import { paths } from "@routes/paths";
import ValuesSection from "@features/home/components/ValuesSection.tsx";

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
                            <Button variant="primary" to={paths.home.contact}>
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