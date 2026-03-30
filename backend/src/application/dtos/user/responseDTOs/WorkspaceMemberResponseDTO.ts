export interface WorkspaceMemberResponseDTO {
    id: string;
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phone?: string;
    isEmailVerified?: boolean;
    onboardingCompleted?: boolean;
    lastSeenAt?: Date;
}
