export const companyPaths = {
    default: '/companies',
    search: '/companies/search',
    dashboard: {
        default: '/companies/:companyId',
        overview: '/companies/:companyId/overview',
        filings: '/companies/:companyId/filings',
        analytics: '/companies/:companyId/analytics',
        alerts: '/companies/:companyId/alerts',
        settings: '/companies/:companyId/settings',
    }
}

export default companyPaths;