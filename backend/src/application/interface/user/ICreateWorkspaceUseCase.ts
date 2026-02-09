import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";

export interface ICreateWorkspaceUseCase {
    execute(workspace: IWorkspaceEntity): Promise<IWorkspaceEntity>;
}