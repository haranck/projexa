import { IPlanRepository } from "../../../../domain/interfaces/repositories/IPlanRepository";
import { IPlanEntity } from "../../../../domain/entities/IPlanEntity";
import { BaseRepo } from "./base/BaseRepo";
import { Model } from "mongoose";
import { PlanModel } from "../models/PlanModel";
import { SUBSCRIPTION_ERRORS } from "../../../../domain/constants/errorMessages";

export class PlanRepository extends BaseRepo<IPlanEntity> implements IPlanRepository {

    constructor() {
        super(PlanModel as unknown as Model<IPlanEntity>)
    }

    async createPlan(plan: IPlanEntity): Promise<IPlanEntity> {
        const id = await super.create({
            name: plan.name,
            price: plan.price,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            interval: plan.interval,
            features: plan.features,
            isActive: plan.isActive
        } as IPlanEntity);

        const createdDoc = await super.findById(id);
        if (!createdDoc) throw new Error(SUBSCRIPTION_ERRORS.PLAN_CREATION_FAILED);
        return createdDoc;
    }

    async getPlanById(id: string): Promise<IPlanEntity | null> {
        const plan = await super.findById(id);
        return plan;
    }

    async getPlanByNameAndInterval(name: string, interval: string): Promise<IPlanEntity | null> {
        const plan = await this.model.findOne({ name, interval });
        return plan;
    }

    async getAllPlans(): Promise<IPlanEntity[]> {
        const plans = await this.model.find();
        return plans;
    }
}