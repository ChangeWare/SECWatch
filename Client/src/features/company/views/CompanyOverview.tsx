import AccountsPayableSection from "@features/company/components/AccountsPayableSection.tsx";
import {Card} from "@common/components/Card.tsx";

const RichPaletteDemo = () => {
    // New color system
    const colors = {
        // Base theme colors
        background: {
            name: 'Deep Space',
            value: '#1a1f35', // Rich navy with hint of purple
            usage: 'Main background color'
        },
        surface: {
            name: 'Slate Night',
            value: '#242b45', // Slightly lighter surface
            usage: 'Primary card background'
        },
        // Primary palette
        primary: {
            name: 'Royal Indigo',
            value: '#4f46e5', // Bright but professional
            usage: 'Primary actions, key data'
        },
        secondary: {
            name: 'Emerald Mist',
            value: '#10b981', // Success, positive trends
            usage: 'Success states, growth indicators'
        },
        accent: {
            name: 'Amber Gold',
            value: '#f59e0b', // Warm accent
            usage: 'Warnings, highlights'
        },
        // Supporting colors
        supporting: [
            {
                name: 'Coral Reef',
                value: '#f43f5e', // Warm red
                usage: 'Negative trends, alerts'
            },
            {
                name: 'Ocean Spray',
                value: '#0ea5e9', // Bright blue
                usage: 'Information, links'
            },
            {
                name: 'Lavender Mist',
                value: '#8b5cf6', // Soft purple
                usage: 'Tertiary actions'
            }
        ]
    };

    return (
        <div className="p-6 space-y-8" style={{ background: colors.background.value }}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">New Color System</h2>
                <p className="text-white/70">Balanced palette for financial interfaces</p>
            </div>

            {/* Main Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[colors.primary, colors.secondary, colors.accent].map((color) => (
                    <Card
                        key={color.name}
                        className="p-6 border border-white/10"
                        style={{ background: colors.surface.value }}
                    >
                        <div
                            className="w-full h-24 rounded-lg mb-4"
                            style={{ background: color.value }}
                        />
                        <h3 className="text-white font-medium mb-1">{color.name}</h3>
                        <p className="text-white/60 text-sm mb-2">{color.value}</p>
                        <p className="text-white/80 text-sm">{color.usage}</p>
                    </Card>
                ))}
            </div>

            {/* Supporting Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {colors.supporting.map((color) => (
                    <Card
                        key={color.name}
                        className="p-6 border border-white/10"
                        style={{ background: colors.surface.value }}
                    >
                        <div
                            className="w-full h-24 rounded-lg mb-4"
                            style={{ background: color.value }}
                        />
                        <h3 className="text-white font-medium mb-1">{color.name}</h3>
                        <p className="text-white/60 text-sm mb-2">{color.value}</p>
                        <p className="text-white/80 text-sm">{color.usage}</p>
                    </Card>
                ))}
            </div>

            {/* Example Usage */}
            <Card
                className="p-6 border border-white/10"
                style={{ background: colors.surface.value }}
            >
                <h3 className="text-white font-medium mb-4">Example Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Primary Action */}
                    <button
                        className="px-4 py-2 rounded-lg text-white transition-colors"
                        style={{ background: colors.primary.value }}
                    >
                        Primary Action
                    </button>

                    {/* Success State */}
                    <div
                        className="px-4 py-2 rounded-lg text-white flex items-center justify-center"
                        style={{ background: colors.secondary.value }}
                    >
                        +15.4% Growth
                    </div>

                    {/* Warning State */}
                    <div
                        className="px-4 py-2 rounded-lg text-white flex items-center justify-center"
                        style={{ background: colors.accent.value }}
                    >
                        Pending Review
                    </div>

                    {/* Alert State */}
                    <div
                        className="px-4 py-2 rounded-lg text-white flex items-center justify-center"
                        style={{ background: colors.supporting[0].value }}
                    >
                        Critical Alert
                    </div>
                </div>
            </Card>
        </div>
    );
};

const BackgroundComparison = () => {
    const backgrounds = [
        {
            name: 'Current Theme',
            color: '#023047',
            description: 'Deep blue background',
            sample: {
                card: '#134f6c',
                nested: '#16435a'
            }
        },
        {
            name: 'Proposed Theme',
            color: '#1a1f35',
            description: 'Navy with purple undertones',
            sample: {
                card: '#242b45',
                nested: '#2d3555'
            }
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {backgrounds.map((bg) => (
                <div
                    key={bg.name}
                    className="p-8 rounded-xl"
                    style={{ background: bg.color }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">{bg.name}</h2>
                        <p className="text-white/70 mb-2">{bg.description}</p>
                        <code className="text-sm text-white/60 bg-black/20 px-2 py-1 rounded">
                            {bg.color}
                        </code>
                    </div>

                    {/* Sample Card Hierarchy */}
                    <Card
                        className="p-4 border border-white/10"
                        style={{ background: bg.sample.card }}
                    >
                        <h3 className="text-white font-medium mb-3">Parent Card</h3>
                        <Card
                            className="p-4 border border-white/10"
                            style={{ background: bg.sample.nested }}
                        >
                            <h4 className="text-white/90 font-medium mb-2">Nested Card</h4>
                            <p className="text-white/70 text-sm">
                                Sample content showing text contrast
                            </p>
                        </Card>
                    </Card>

                    {/* Sample Content */}
                    <div className="mt-6 space-y-4">
                        <div className="flex gap-4">
                            <button
                                className="px-4 py-2 rounded bg-[#4f46e5] text-white hover:opacity-90 transition"
                            >
                                Primary Action
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-[#10b981] text-white hover:opacity-90 transition"
                            >
                                Success
                            </button>
                        </div>
                        <div
                            className="p-3 rounded"
                            style={{ background: bg.sample.card }}
                        >
                            <p className="text-white font-medium">100% Text Opacity</p>
                            <p className="text-white/70">70% Text Opacity</p>
                            <p className="text-white/50">50% Text Opacity</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};



export function CompanyOverview() {
    return (
        <div className="space-y-8">
            <BackgroundComparison />
            <RichPaletteDemo />
            <AccountsPayableSection />
        </div>
    )
}