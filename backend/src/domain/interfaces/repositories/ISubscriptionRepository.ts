import { ISubscriptionEntity } from "../../entities/ISubscriptionEntity";

export interface ISubscriptionRepository {
    createSubscription(subscription:ISubscriptionEntity):Promise<ISubscriptionEntity>
}