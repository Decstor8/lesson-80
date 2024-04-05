export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Place {
    id: number;
    name: string;
    description?: string;
  }

export interface ErrorResponse {
    message: string;
    error?: string | unknown;
}