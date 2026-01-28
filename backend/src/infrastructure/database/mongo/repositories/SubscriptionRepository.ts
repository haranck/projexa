import { ISubscriptionEntity } from "../../../../domain/entities/ISubscriptionEntity";
import { ISubscriptionRepository } from "../../../../domain/interfaces/repositories/ISubscriptionRepository";
import { injectable } from 'tsyringe'
import { BaseRepo } from './base/BaseRepo'
import { Model } from 'mongoose'
import { SubscriptionModel } from "../models/SubscriptionModel";
import { SUBSCRIPTION_ERRORS } from "../../../../domain/constants/errorMessages";

@injectable()
export class SubscriptionRepository extends BaseRepo<ISubscriptionEntity> implements ISubscriptionRepository {
    constructor() {
        super(SubscriptionModel as unknown as Model<ISubscriptionEntity>)
    }
    async createSubscription(subscription: ISubscriptionEntity): Promise<ISubscriptionEntity> {
        const doc = await super.create({
            userId: subscription.userId,
            workspaceId: subscription.workspaceId,
            planId: subscription.planId,
            status: subscription.status,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripeCustomerId: subscription.stripeCustomerId,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        })
        const createdDoc = await super.findById(doc);
        if (!createdDoc) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_CREATION_FAILED);
        return createdDoc;
    }
}