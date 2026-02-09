import { PlanInterval } from "../../../../domain/enums/PlanInterval";

export interface CreatePlanDTO {
  name: string;
  price: number;
  maxMembers: number;
  maxProjects: number;
  interval: PlanInterval;
  features: string[];
}
