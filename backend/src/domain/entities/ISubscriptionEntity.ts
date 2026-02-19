import { SubscriptionStatus } from "../enums/SubscriptionStatus";

export interface ISubscriptionEntity {
    _id?: string;
    userId: string;
    workspaceId: string;
    planId: string;
    status: SubscriptionStatus;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
