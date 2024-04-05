export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface ErrorResponse {
    message: string;
    error?: any;
}