import { IUpdateProjectUseCase } from "../../interface/project/IUpdateProjectUseCase";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { injectable, inject } from "tsyringe";
import { UpdateProjectDTO } from "../../dtos/project/requestDTOs/UpdateProjectDTO";
import { PROJECT_ERRORS, WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
    constructor(
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository,
        @inject("IWorkspaceRepository") private readonly _workspaceRepository: IWorkspaceRepository,
        @inject("IProjectMemberRepository") private readonly _projectMemberRepository: IProjectMemberRepository,
        @inject("IRoleRepository") private readonly _roleRepo: IRoleRepository,
    ) { }

    async execute(data: UpdateProjectDTO, requesterId: string): Promise<IProjectEntity> {
        const project = await this._projectRepository.getProjectById(data.projectId);
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);

        const workspace = await this._workspaceRepository.getWorkspaceById(project.workspaceId);
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);

        let isAuthorized = workspace.ownerId?.toString() === requesterId.toString();

        if (!isAuthorized) {
            const requesterMember = await this._projectMemberRepository.findProjectAndUser(data.projectId, requesterId);
            if (requesterMember) {
                const role = await this._roleRepo.getRoleById(requesterMember.roleId);
                if (role && role.name === ProjectRole.PROJECT_MANAGER) {
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_UPDATE_PROJECT);
        }

        const updatedProject = await this._projectRepository.updateProject(data.projectId, data);
        if (!updatedProject) throw new Error(PROJECT_ERRORS.PROJECT_UPDATE_FAILED);
        return updatedProject;
    }
}