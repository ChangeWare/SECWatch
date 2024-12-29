export interface CompanyDetailsResponse {
    company: CompanyDetails;
}

export interface CompanyDetails {
    cik: string;
    name: string;
    mailingAddress: CompanyAddress;
    businessAddress: CompanyAddress;
    lastUpdated: Date;
}

export interface CompanyAddress {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    county: string;
}