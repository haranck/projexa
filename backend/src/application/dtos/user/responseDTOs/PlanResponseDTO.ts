import { PlanInterval } from '../../../../domain/enums/PlanInterval';

export interface PlanResponseDTO {
    id: string;
    name: string;
    price: number;
    interval: PlanInterval;
    maxMembers: number;
    maxProjects: number;
    features: string[];
    isActive: boolean;
    stripePriceId?: string;
}
