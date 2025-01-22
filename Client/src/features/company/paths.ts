export const companyPaths = {
    default: '/companies',
    search: '/companies/search',
    tracked: '/companies/tracked',
    dashboard: {
        default: '/companies/:companyId',
        overview: 'overview',
        filings: 'filings', // Changed to relative
        filing: 'filings/:accessionNumber',
        concepts: 'concepts',
        analysis: 'analysis',
        alerts: 'alerts',
        settings: 'settings',
    }
}

export default companyPaths;