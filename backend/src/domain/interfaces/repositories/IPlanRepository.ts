import { IPlanEntity } from "../../entities/IPlanEntity";
import { UpdatePlanDTO } from "../../../application/dtos/admin/requestDTOs/UpdatePlanDTO";
import { UpdatePlanResponseDTO } from "../../../application/dtos/admin/responseDTOs/UpdatePlanResponseDTO";

export interface IPlanRepository {
    createPlan(plan: IPlanEntity): Promise<IPlanEntity>;
    getPlanById(id: string): Promise<IPlanEntity | null>;
    getPlanByNameAndInterval(name: string,interval: string): Promise<IPlanEntity | null>;
    getAllPlans():Promise<IPlanEntity[]>;
    updatePlan(planId:string,dto:UpdatePlanDTO):Promise<UpdatePlanResponseDTO>
}