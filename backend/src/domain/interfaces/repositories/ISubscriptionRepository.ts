import { ISubscriptionEntity } from "../../entities/ISubscriptionEntity";
import { IBaseRepository } from "./base/IBaseRepository";

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionEntity> {
    createSubscription(subscription: ISubscriptionEntity): Promise<ISubscriptionEntity>
    findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<ISubscriptionEntity | null>
    findByStripePriceId(stripePriceId: string): Promise<ISubscriptionEntity | null>
    updateSubscription(subscriptionId: string, subscription: Partial<ISubscriptionEntity>): Promise<ISubscriptionEntity>
    findByStripeCustomerId(stripeCustomerId: string): Promise<ISubscriptionEntity | null>
    findByWorkspaceId(workspaceId: string): Promise<ISubscriptionEntity | null>
}