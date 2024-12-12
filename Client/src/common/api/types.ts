export interface ApiErrorResponse {
    title: string;
    status: number;
    errors: {
        [key: string]: string[];
    };
}