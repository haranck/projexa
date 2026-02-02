import { IWorkspaceEntity } from "../../entities/IWorkspaceEntity";

export interface IWorkspaceRepository {
    createWorkspace(workspace: IWorkspaceEntity): Promise<IWorkspaceEntity>;
    getWorkspaceById(id: string): Promise<IWorkspaceEntity | null>;
    getWorkspaceByOwnerId(ownerId: string): Promise<IWorkspaceEntity | null>;
    getWorkspaceByName(name: string): Promise<IWorkspaceEntity | null>;
    updateWorkspace(id: string, workspace: IWorkspaceEntity): Promise<IWorkspaceEntity>;
    getWorkspacesByUserId(userId: string): Promise<IWorkspaceEntity[]>;
}