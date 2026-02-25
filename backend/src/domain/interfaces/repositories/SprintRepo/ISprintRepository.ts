import { ISprintEntity } from "../../../entities/Sprint/ISprintEntity";

export interface ISprintRepository {
    createSprint(sprintData: ISprintEntity): Promise<ISprintEntity>;
    getSprintById(sprintId: string): Promise<ISprintEntity | null>;
    getSprintsByProjectId(projectId: string): Promise<ISprintEntity[]>;
    updateSprint(sprintId: string, sprintData: Partial<ISprintEntity>): Promise<ISprintEntity | null>;
    deleteSprint(sprintId: string): Promise<boolean>;
    getSprintsByWorkspaceId(workspaceId: string): Promise<ISprintEntity[]>;
    countByProjectId(projectId: string): Promise<number>;
}