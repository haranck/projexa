import { inject, injectable } from "tsyringe";
import { IPlanEntity } from "../../../domain/entities/IPlanEntity";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { CreatePlanDTO } from "../../dtos/admin/requestDTOs/CreatePlanDTO";
import { ICreatePlanUseCase } from "../../interface/admin/ICreatePlanUseCase";
import { CreatePlanResponseDTO } from "../../dtos/admin/responseDTOs/CreatePlanResponseDTO";
import { SUBSCRIPTION_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class CreatePlanUseCase implements ICreatePlanUseCase {
    constructor(
        @inject("IPlanRepository") private readonly _planRepo: IPlanRepository
    ) { }
    async execute(data: CreatePlanDTO): Promise<CreatePlanResponseDTO> {
        const planExists = await this._planRepo.getPlanByNameAndInterval(data.name, data.interval);
        if (planExists) throw new Error(SUBSCRIPTION_ERRORS.PLAN_ALREADY_EXISTS);
        const plan: IPlanEntity = {
            name: data.name,
            price: data.price,
            maxMembers: data.maxMembers,
            maxProjects: data.maxProjects,
            interval: data.interval,
            features: data.features,
            isActive: true
        }
        const createdPlan = await this._planRepo.createPlan(plan);

        return {
            id: createdPlan.id!,
            name: createdPlan.name,
            price: createdPlan.price,
            maxMembers: createdPlan.maxMembers,
            maxProjects: createdPlan.maxProjects,
            interval: createdPlan.interval,
            features: createdPlan.features,
            isActive: createdPlan.isActive,
            createdAt: createdPlan.createdAt!,
            updatedAt: createdPlan.updatedAt!
        };
    }
}
