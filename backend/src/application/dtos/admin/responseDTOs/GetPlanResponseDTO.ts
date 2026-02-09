import { PlanInterval } from "../../../../domain/enums/PlanInterval";

export interface GetPlanResponseDTO {
    id?: string;
    name: string;
    price: number;
    maxMembers: number;
    maxProjects: number;
    interval: PlanInterval;
    features: string[];
    isActive: boolean
}