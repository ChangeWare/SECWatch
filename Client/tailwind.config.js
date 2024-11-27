import plugin from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          blue: {
            light: '#8ecae6',
            DEFAULT: '#219ebc',
            dark: '#023047',
          },
          orange: {
            light: '#ffb703',
            DEFAULT: '#fb8500',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addComponents }) => {
      addComponents({
        '.glass-card': {
          '@apply bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition': {},
          '&:hover': {
            '@apply border-main-orange-light/50 transform scale-105': {},
          },
        },
        '.glass-container': {
          '@apply bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl': {},
        },
      });
    }),
  ],
}

