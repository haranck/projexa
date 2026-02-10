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
    async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<ISubscriptionEntity | null> {
        const doc = await this.model.findOne({ stripeSubscriptionId });
        if (!doc) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        return doc;
    }
    async findByStripePriceId(stripePriceId: string): Promise<ISubscriptionEntity | null> {
        const doc = await this.model.findOne({ stripePriceId });
        if (!doc) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        return doc;
    }
    async updateSubscription(subscriptionId: string, subscription: Partial<ISubscriptionEntity>): Promise<ISubscriptionEntity> {
        const updatedDoc = await this.model.findByIdAndUpdate(subscriptionId, subscription, { new: true }).lean<ISubscriptionEntity>();
        if (!updatedDoc) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        return updatedDoc;
    }
    async findByWorkspaceId(workspaceId: string): Promise<ISubscriptionEntity | null> {
        const doc = await this.model.findOne({ workspaceId });
        if (!doc) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        return doc;
    }
    async findByStripeCustomerId(stripeCustomerId: string): Promise<ISubscriptionEntity | null> {
        const doc = await this.model.findOne({ stripeCustomerId });
        return doc;
    }
}