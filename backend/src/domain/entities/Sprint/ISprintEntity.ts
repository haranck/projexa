import { SprintStatus } from "../../enums/SprintStatus";

export interface ISprintEntity {
    _id: string;
    workSpaceId: string;
    projectId: string;
    name: string;
    goal?: string;
    status: SprintStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}