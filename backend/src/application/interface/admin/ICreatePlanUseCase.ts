import { CreatePlanDTO } from "../../dtos/admin/requestDTOs/CreatePlanDTO";
import { CreatePlanResponseDTO } from "../../dtos/admin/responseDTOs/CreatePlanResponseDTO";

export interface ICreatePlanUseCase {
    execute(data: CreatePlanDTO): Promise<CreatePlanResponseDTO>;
}
