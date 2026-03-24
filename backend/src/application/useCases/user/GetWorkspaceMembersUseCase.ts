import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IGetWorkspaceMembersUseCase } from "../../interface/user/IGetWorkspaceMembersUseCase";
import { WorkspaceMemberResponseDTO } from "../../dtos/user/responseDTOs/WorkspaceMemberResponseDTO";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class GetWorkspaceMembersUseCase implements IGetWorkspaceMembersUseCase {
    constructor(
        @inject('IWorkspaceRepository') private readonly _workspaceRepository: IWorkspaceRepository
    ) { }

    async execute(workspaceId: string): Promise<WorkspaceMemberResponseDTO[]> {
        const members = await this._workspaceRepository.getWorkspaceMembers(workspaceId)
        return UserDTOmapper.toWorkspaceMemberListResponseDTO(members)
    }
}