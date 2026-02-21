import { injectable, inject } from "tsyringe"
import { IRemoveProjectMemberUseCase } from "../../interface/project/IRemoveProjectMemberUseCase";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";

@injectable()
export class RemoveProjectMemberUseCase implements IRemoveProjectMemberUseCase {
    constructor(
        @inject("IProjectMemberRepository") private readonly _projectMemberRepository: IProjectMemberRepository,
        @inject('IProjectRepository') private readonly _projectRepository: IProjectRepository
    ) { }

    async execute(data: { projectId: string; userId: string }): Promise<void> {
        const project = await this._projectRepository.getProjectById(data.projectId)
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

        if (project.createdBy === data.userId) throw new Error(PROJECT_ERRORS.CANNOT_REMOVE_CREATOR)

        const projectMember = await this._projectMemberRepository.findProjectAndUser(data.projectId, data.userId)
        if (!projectMember) throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_NOT_FOUND)

        await this._projectMemberRepository.removeMember(projectMember._id!)
    }
}
