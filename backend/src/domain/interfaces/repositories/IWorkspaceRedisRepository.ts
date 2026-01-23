import { IWorkspaceEntity } from "../../entities/IWorkspaceEntity";

export interface IWorkspaceRedisRepository {
    save(workspace:IWorkspaceEntity):Promise<IWorkspaceEntity>;
}