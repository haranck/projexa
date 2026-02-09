import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";

export interface IGetUserWorkspaceUseCase {
    execute(userId: string): Promise<IWorkspaceEntity[]>;
}