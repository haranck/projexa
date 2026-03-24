import { IGetAllPlansForUserUseCase } from "../../interface/user/IGetAllPlansForUserUseCase";
import { PlanResponseDTO } from "../../dtos/user/responseDTOs/PlanResponseDTO";
import { injectable, inject } from "tsyringe";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class GetAllPlansForUserUseCase implements IGetAllPlansForUserUseCase {
    constructor(
        @inject("IPlanRepository") private _planRepository: IPlanRepository
    ) {}
    async execute(): Promise<PlanResponseDTO[]> {
        const plans = await this._planRepository.getAllPlans();
        return UserDTOmapper.toPlanListResponseDTO(plans.filter(plan => plan.isActive));
    }
}