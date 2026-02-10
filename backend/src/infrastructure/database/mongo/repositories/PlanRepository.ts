import { IPlanRepository } from "../../../../domain/interfaces/repositories/IPlanRepository";
import { IPlanEntity } from "../../../../domain/entities/IPlanEntity";
import { BaseRepo } from "./base/BaseRepo";
import { Model } from "mongoose";
import { PlanModel } from "../models/PlanModel";
import { SUBSCRIPTION_ERRORS } from "../../../../domain/constants/errorMessages";
import { UpdatePlanDTO } from "../../../../application/dtos/admin/requestDTOs/UpdatePlanDTO";
import { UpdatePlanResponseDTO } from "../../../../application/dtos/admin/responseDTOs/UpdatePlanResponseDTO";
import { injectable } from "tsyringe";

@injectable()
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
            isActive: plan.isActive,
            stripeProductId: plan.stripeProductId,
            stripePriceId: plan.stripePriceId
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

    async updatePlan(planId: string, dto: UpdatePlanDTO): Promise<UpdatePlanResponseDTO> {
        const plan = await super.findById(planId);
        if (!plan) throw new Error(SUBSCRIPTION_ERRORS.PLAN_NOT_FOUND);

        await super.update(dto, planId);
        const updatedDoc = await super.findById(planId);
        if (!updatedDoc) throw new Error(SUBSCRIPTION_ERRORS.PLAN_NOT_FOUND);
        return {
            id: updatedDoc._id?.toString() || planId,
            name: updatedDoc.name,
            price: updatedDoc.price,
            maxMembers: updatedDoc.maxMembers,
            maxProjects: updatedDoc.maxProjects,
            interval: updatedDoc.interval,
            features: updatedDoc.features,
            isActive: updatedDoc.isActive,
            createdAt: updatedDoc.createdAt!,
            updatedAt: updatedDoc.updatedAt!
        };
    }

    async getPlanByStripePriceId(stripePriceId: string): Promise<IPlanEntity | null> {
        const plan = await this.model.findOne({ stripePriceId });
        return plan;
    }
}