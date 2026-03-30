import { injectable, inject } from "tsyringe";
import { GetPlanResponseDTO } from "../../dtos/admin/responseDTOs/GetPlanResponseDTO";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { IGetPlanUseCase } from "../../interface/admin/IGetPlanUseCase";
import { AdminDTOmapper } from "../../mappers/Admin/AdminDTOmapper";

@injectable()
export class GetPlanUseCase implements IGetPlanUseCase {
    constructor(
        @inject("IPlanRepository") private readonly _planRepo: IPlanRepository
    ) { }
    async execute(): Promise<{ data: GetPlanResponseDTO[] }> {
        const plans = await this._planRepo.getAllPlans();
        return { data: AdminDTOmapper.toGetPlanResponseDTO(plans) };
    }
}
