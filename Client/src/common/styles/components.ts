// styles/components.ts
export const glassStyles = {
    card: "bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:border-main-orange-light/50 hover:transform hover:scale-105 transition",
    container: "bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10",
};

export const textStyles = {
    heading: "text-3xl font-bold text-white mb-4",
    subheading: "text-xl md:text-2xl text-gray-300 mb-8",
    paragraph: "text-gray-300",
};

export const layoutStyles = {
    section: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",  // Added explicit padding
    navSection: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",
    contentSection: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", // For larger sections
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
};