import { PlanInterval } from "../../../../domain/enums/PlanInterval";

export interface UpdatePlanResponseDTO {
    id: string;
    name: string;
    price: number;
    interval: PlanInterval;
    features: string[];
    maxMembers: number;
    maxProjects: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}