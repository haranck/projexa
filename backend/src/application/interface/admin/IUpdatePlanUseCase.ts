import { UpdatePlanDTO } from "../../dtos/admin/requestDTOs/UpdatePlanDTO";
import { UpdatePlanResponseDTO } from "../../dtos/admin/responseDTOs/UpdatePlanResponseDTO";

export interface IUpdatePlanUseCase{
    execute(planId:string,dto:UpdatePlanDTO):Promise<UpdatePlanResponseDTO>;
}
