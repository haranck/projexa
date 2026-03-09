import { inject, injectable } from "tsyringe";
import { IPlanEntity } from "../../../domain/entities/IPlanEntity";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { CreatePlanDTO } from "../../dtos/admin/requestDTOs/CreatePlanDTO";
import { ICreatePlanUseCase } from "../../interface/admin/ICreatePlanUseCase";
import { CreatePlanResponseDTO } from "../../dtos/admin/responseDTOs/CreatePlanResponseDTO";
import { SUBSCRIPTION_ERRORS } from "../../../domain/constants/errorMessages";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";

@injectable()
export class CreatePlanUseCase implements ICreatePlanUseCase {
    constructor(
        @inject("IPlanRepository") private readonly _planRepo: IPlanRepository,
        @inject("IStripeService") private readonly _stripeService: IStripeService
    ) { }
    async execute(data: CreatePlanDTO): Promise<CreatePlanResponseDTO> {
        const planExists = await this._planRepo.getPlanByNameAndInterval(data.name, data.interval);
        if (planExists) throw new Error(SUBSCRIPTION_ERRORS.PLAN_ALREADY_EXISTS);

        const stripeInterval = data.interval === 'MONTHLY' ? 'month' : 'year';

        const stripeData = await this._stripeService.createProductAndPrice({
            name: data.name,
            amount: data.price,
            interval: stripeInterval
        });

        const plan: IPlanEntity = {
            name: data.name,
            price: data.price,
            maxMembers: data.maxMembers,
            maxProjects: data.maxProjects,
            interval: data.interval,
            features: data.features,
            isActive: true,
            stripeProductId: stripeData.productId,
            stripePriceId: stripeData.priceId
        }
        const createdPlan = await this._planRepo.createPlan(plan);

        return {
            id: createdPlan._id!,
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
