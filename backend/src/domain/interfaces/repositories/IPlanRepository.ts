import { IPlanEntity } from "../../entities/IPlanEntity";

export interface IPlanRepository {
    createPlan(plan: IPlanEntity): Promise<IPlanEntity>;
    getPlanById(id: string): Promise<IPlanEntity | null>;
    getPlanByNameAndInterval(name: string,interval: string): Promise<IPlanEntity | null>;
    getAllPlans():Promise<IPlanEntity[]>;
}