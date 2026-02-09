import { UpdatePlanDTO } from "../../dtos/admin/requestDTOs/UpdatePlanDTO";
import { UpdatePlanResponseDTO } from "../../dtos/admin/responseDTOs/UpdatePlanResponseDTO";
import { IUpdatePlanUseCase } from "../../interface/admin/IUpdatePlanUseCase";
import { inject, injectable } from "tsyringe";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";

@injectable()
export class UpdatePlanUseCase implements IUpdatePlanUseCase {
    constructor(
        @inject("IPlanRepository") private readonly _planRepo: IPlanRepository
    ) { }
    async execute(planId: string, dto: UpdatePlanDTO): Promise<UpdatePlanResponseDTO> {
        const updatedPlan = await this._planRepo.updatePlan(planId, dto)
        return updatedPlan
    }
}

