export const companyPaths = {
    default: '/companies',
    search: '/companies/search',
    tracked: '/companies/tracked',
    dashboard: {
        default: '/companies/:companyId',
        overview: 'overview',         // Changed to relative
        filings: 'filings', // Changed to relative
        filing: 'filings/:accessionNumber',
        analysis: 'analysis',       // Changed to relative
        alerts: 'alerts',            // Changed to relative
        settings: 'settings',        // Changed to relative
    }
}

export default companyPaths;