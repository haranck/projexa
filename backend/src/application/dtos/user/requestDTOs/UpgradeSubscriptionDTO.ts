export interface UpgradeSubscriptionInputDTO {
    workspaceId: string;
    userId: string;
    newPriceId: string; // Stripe Price ID of new plan
}
