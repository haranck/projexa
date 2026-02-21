import { ICreateProjectUseCase } from "../../interface/project/ICreateProjectUseCase";
import { injectable, inject } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { CreateProjectDTO } from "../../dtos/project/requestDTOs/CreateProjectDTO";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
    constructor(
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository
    ) { }

    async execute(project: CreateProjectDTO): Promise<IProjectEntity> {
        const existingProject = await this._projectRepo.getProjectByKey(project.workspaceId, project.key)
        if (existingProject) throw new Error(PROJECT_ERRORS.PROJECT_ALREADY_EXISTS)

        const createdProject = await this._projectRepo.createProject(project)

        const projectManager = await this._roleRepo.getRoleByName(ProjectRole.PROJECT_MANAGER)
        if (!projectManager) throw new Error(PROJECT_ERRORS.PROJECT_ROLE_NOT_FOUND)

        await this._projectMemberRepo.addMemberToProject({
            projectId: createdProject._id!,
            userId: project.createdBy,
            roleId: projectManager._id!
        })

        if (project.members && project.members.length > 0) {
            for (const member of project.members) {
                await this._projectMemberRepo.addMemberToProject({
                    projectId: createdProject._id!,
                    userId: member.userId,
                    roleId: member.roleId
                })
            }
        }

        return createdProject
    }
}
