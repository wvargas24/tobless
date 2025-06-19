export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

export interface AuthResponse {
    token: string;
}
