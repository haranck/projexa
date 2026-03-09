import { RemoveMemberDTO } from "../../dtos/user/requestDTOs/RemoveMemberDTO";
import { IRemoveWorkspaceMemberUseCase } from "../../interface/user/IRemoveWorkspaceMemberUseCase";
import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";


@injectable()
export class RemoveWorkspaceMemberUseCase implements IRemoveWorkspaceMemberUseCase {
    constructor(
        @inject('IWorkspaceRepository') private _workspaceRepo: IWorkspaceRepository,
        @inject('IProjectRepository') private _projectRepo: IProjectRepository
    ) { }
    async execute(dto: RemoveMemberDTO): Promise<void> {
        const workspace = await this._workspaceRepo.getWorkspaceById(dto.workspaceId)
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)

        if (workspace.ownerId?.toString() !== dto.requesterId) {
            throw new Error(WORKSPACE_ERRORS.NOT_AUTHORIZED_REMOVE_MEMBER)
        }

        if (workspace.ownerId?.toString() === dto.memberId) {
            throw new Error(WORKSPACE_ERRORS.CANNOT_REMOVE_OWNER)
        }

        const isMember = workspace.members?.some(
            (m) => m.toString() === dto.memberId
        );

        if (!isMember) {
            throw new Error(WORKSPACE_ERRORS.MEMBER_NOT_FOUND)
        }

        await this._workspaceRepo.removeMember(dto.workspaceId, dto.memberId)
    }
}