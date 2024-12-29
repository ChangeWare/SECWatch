import plugin from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				// Base theme
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				surface: {
					DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
					foreground: 'hsl(var(--surface-foreground) / <alpha-value>)'
				},

				secondary: {
					DEFAULT: 'hsl(var(--foreground) / .7)',
				},

				tertiary: {
					DEFAULT: 'hsl(var(--foreground) / .5)',
				},

				// UI Action colors
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				error: {
					DEFAULT: 'hsl(var(--error))',
					foreground: 'hsl(var(--error-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},

				// Metrics-specific colors
				metrics: {
					strong: 'hsl(var(--metrics-strong))',
					growth: 'hsl(var(--metrics-growth))',
					stable: 'hsl(var(--metrics-stable))',
					decline: 'hsl(var(--metrics-decline))'
				},

				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},

				border: 'hsl(var(--border))'
			}
		}
	},
	plugins: [
		import('@tailwindcss/forms'),
		plugin(({ addComponents }) => {
			addComponents({
				'.glass-card': {
					'@apply bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition': {},
					'&:hover': {
						'@apply border-success/50 transform scale-105': {},
					},
				},
				'.glass-container': {
					'@apply bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl': {},
				},
			});
		}),
		import("tailwindcss-animate")
	],
}