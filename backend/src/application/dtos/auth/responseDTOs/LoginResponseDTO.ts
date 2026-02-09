interface workspaceSummary {
    id: string;
    name: string;
    ownerId: string;
}

export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    hasWorkspace: boolean;
    workspaces: workspaceSummary[];
    defaultWorkspace: workspaceSummary | null;
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
