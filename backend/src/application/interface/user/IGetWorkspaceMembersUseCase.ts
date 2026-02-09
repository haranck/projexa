import { IUserEntity } from "../../../domain/entities/IUserEntity";
export interface IGetWorkspaceMembersUseCase {
    execute(workspaceId: string): Promise<IUserEntity[]>;
}