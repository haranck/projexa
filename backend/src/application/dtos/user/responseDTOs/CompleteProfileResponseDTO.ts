export interface CompleteProfileResponseDTO {
    id: string;
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    onboardingCompleted: boolean;
}
