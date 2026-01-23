import { PlanInterval } from "../../../../domain/enums/PlanInterval";

export interface UpdatePlanDTO {
    name?: string;
    price?: number;
    maxMembers?: number;
    maxProjects?: number;
    interval?: PlanInterval;
    features?: string[];
    isActive?: boolean;
}