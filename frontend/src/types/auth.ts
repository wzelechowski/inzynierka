export interface AuthRequest {
    email: string;
    password?: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface RegisterResponse {
    id: String;
    firstName: String;
    lastName: String;
    email: String;
    phoneNumber: String;
}

export interface RefreshTokenRequest {
    refreshToken: String;
}