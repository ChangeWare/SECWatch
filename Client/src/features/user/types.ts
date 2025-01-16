export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    lastLoginAt: string;
}

export enum UserPreferenceKeys {
    RecentFilingsWidget = 'recent-filings-widget'
}

export interface UserPreference {

}

export interface RecentFilingsWidgetPreference extends UserPreference {
    numFilingsToShow: number;
    showTicker: boolean;
    showFilingType: boolean;
}