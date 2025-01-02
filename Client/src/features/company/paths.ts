export const companyPaths = {
    default: '/companies',
    search: '/companies/search',
    dashboard: {
        default: '/companies/:companyId',
        overview: 'overview',         // Changed to relative
        filings: 'filings',          // Changed to relative
        analytics: 'analytics',       // Changed to relative
        alerts: 'alerts',            // Changed to relative
        settings: 'settings',        // Changed to relative
    }
}

export default companyPaths;