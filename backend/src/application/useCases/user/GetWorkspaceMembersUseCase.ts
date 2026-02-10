import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IGetWorkspaceMembersUseCase } from "../../interface/user/IGetWorkspaceMembersUseCase";
import { IUserEntity } from "../../../domain/entities/IUserEntity";

@injectable()
export class GetWorkspaceMembersUseCase implements IGetWorkspaceMembersUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository,
        @inject('IWorkspaceRepository') private readonly _workspaceRepository: IWorkspaceRepository
    ) { }

    async execute(workspaceId: string): Promise<IUserEntity[]> {
        const members = await this._workspaceRepository.getWorkspaceMembers(workspaceId)
        return members.map(member => member)   
    }
}