export interface GoogleLoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    hasWorkspace: boolean;
    workspaces: Array<{
        id: string;
        name: string;
        ownerId: string;
    }>;
    defaultWorkspace: {
        id: string;
        name: string;
        ownerId: string;
    } | null;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isEmailVerified: boolean;
        avatarUrl?: string;
    }
}
