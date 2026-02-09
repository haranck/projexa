export interface CreateCheckoutSessionUseCaseDTO {
    workspaceName: string;
    userId: string;
    userEmail: string;
    successUrl: string;
    cancelUrl: string;
    planId?: string;
}
