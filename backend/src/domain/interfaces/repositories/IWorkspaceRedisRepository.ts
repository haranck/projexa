import { IWorkspaceEntity } from "../../entities/IWorkspaceEntity";

export interface IWorkspaceRedisRepository {
    save(workspace: IWorkspaceEntity): Promise<IWorkspaceEntity>;
    findByName(workspaceName: string): Promise<IWorkspaceEntity | null>;
    delete(workspaceName: string): Promise<void>;
}