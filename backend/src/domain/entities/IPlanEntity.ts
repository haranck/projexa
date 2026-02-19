import { PlanInterval } from "../enums/PlanInterval";

export interface IPlanEntity {
    _id?: string;
    name: string;
    price: number;
    interval: PlanInterval;
    maxMembers: number;
    maxProjects: number;
    stripeProductId?: string;
    stripePriceId?: string;
    features: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
