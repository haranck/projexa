import { injectable, inject } from "tsyringe";
import { GetPlanResponseDTO } from "../../dtos/admin/responseDTOs/GetPlanResponseDTO";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { IGetPlanUseCase } from "../../interface/admin/IGetPlanUseCase";

@injectable()
export class GetPlanUseCase implements IGetPlanUseCase {
    constructor(
        @inject("IPlanRepository") private readonly _planRepo: IPlanRepository
    ) { }
    async execute(): Promise<{ data: GetPlanResponseDTO[] }> {
        const plans = await this._planRepo.getAllPlans();
        const mappedPlans = plans.map(plan => ({
            id: plan._id?.toString(),
            name: plan.name,
            price: plan.price,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            interval: plan.interval,
            features: plan.features,
            isActive: plan.isActive
        }));
        return { data: mappedPlans };
    }
}   
