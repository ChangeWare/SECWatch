import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card.tsx';
import Button from '@common/components/Button.tsx';
import HyperLink from "@common/components/HyperLink.tsx";

const StyleGuide = () => {
    return (
        <div className="p-8 space-y-6 bg-background min-h-screen">
            <h1 className="text-foreground text-3xl font-bold mb-8">SECWatch Style Guide</h1>

            {/* Text Styles */}
            <Card>
                <CardHeader>
                    <CardTitle>Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h2 className="text-foreground mb-3 text-lg">Main Text</h2>
                        <div className="space-y-2">
                            <p className="text-foreground">Primary Text (text-foreground)</p>
                            <p className="text-secondary">Secondary Text (text-secondary)</p>
                            <p className="text-tertiary">Tertiary Text (text-foreground/50)</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-foreground text-lg mb-3">Interactive Text</h3>
                        <div className="flex flex-col space-y-2">
                            <HyperLink href="#">Primary Link</HyperLink>
                            <HyperLink href="#" variant="subtle">Subtle Link (variant)</HyperLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-foreground text-lg mb-3">Status Text</h3>
                        <div className="space-y-2">
                            <p className="text-success">Success Text (text-success)</p>
                            <p className="text-error">Error Text (text-error)</p>
                            <p className="text-info">Info Text (text-info)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Metric Colors */}
            <Card>
                <CardHeader>
                    <CardTitle>Metric Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-metrics-strong">Strong Growth +25% (text-metrics-strong)</p>
                        <p className="text-metrics-growth">Moderate Growth +12% (text-metrics-growth)</p>
                        <p className="text-metrics-stable">Stable +2% (text-metrics-stable)</p>
                        <p className="text-metrics-decline">Decline -8% (text-metrics-decline)</p>
                    </div>
                </CardContent>
            </Card>

            {/* Surfaces and Cards */}
            <Card>
                <CardHeader>
                    <CardTitle>Surfaces & Cards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Base card content goes here</p>
                            </CardContent>
                        </Card>
                        <Card variant="subtle">
                            <CardHeader>
                                <CardTitle>Subtle Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Subtle card content goes here</p>
                            </CardContent>
                        </Card>
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Elevated card content goes here</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-x-4">
                        <Button variant="primary">
                            Primary Action
                        </Button>
                        <Button variant="secondary">
                            Secondary Action
                        </Button>
                        <Button variant="success">
                            Success Action
                        </Button>
                        <Button variant="danger">
                            Destructive Action
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle>Common Usage Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-foreground font-semibold">Headers & Labels</h3>
                        <ul className="list-disc pl-4 space-y-2 text-foreground/70">
                            <li>Main headers: text-foreground + text-2xl/3xl + font-bold</li>
                            <li>Section headers: text-foreground + text-xl + font-semibold</li>
                            <li>Form labels: text-foreground/70 + text-sm</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-foreground font-semibold">Interactive Elements</h3>
                        <ul className="list-disc pl-4 space-y-2 text-foreground/70">
                            <li>Primary links: text-info hover:text-info/80</li>
                            <li>Nav links: text-secondary hover:text-info</li>
                            <li>Always include: transition-colors duration-200</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-foreground font-semibold">Cards & Containers</h3>
                        <ul className="list-disc pl-4 space-y-2 text-foreground/70">
                            <li>Base cards: bg-surface/30</li>
                            <li>Elevated cards: bg-surface/40</li>
                            <li>Always include: backdrop-blur-sm rounded-xl</li>
                            <li>Optional: shadow-[0_4px_12px_rgba(0,0,0,0.1)]</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-foreground font-semibold">Metric/Status Colors</h3>
                        <ul className="list-disc pl-4 space-y-2 text-foreground/70">
                            <li>Strong growth (+20% or more): text-metrics-strong</li>
                            <li>Moderate growth (5-20%): text-metrics-growth</li>
                            <li>Stable (-5% to +5%): text-metrics-stable</li>
                            <li>Decline (below -5%): text-metrics-decline</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StyleGuide;