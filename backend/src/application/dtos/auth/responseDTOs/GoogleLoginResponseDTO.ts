export interface GoogleLoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isEmailVerified: boolean;
        avatarUrl?: string;
    }
}
