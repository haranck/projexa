import { injectable, inject } from "tsyringe";
import { AddProjectMemberDTO } from "../../dtos/project/requestDTOs/AddProjectMemberDTO"
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IAddProjectMemberUseCase } from "../../interface/project/IAddProjectMemberUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";

@injectable()
export class AddProjectMemberUseCase implements IAddProjectMemberUseCase {
    constructor(
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository,
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    ) { }

    async execute(projectMember: AddProjectMemberDTO): Promise<IProjectMemberEntity> {
        console.log('project member ', projectMember)
        const Project = await this._projectRepo.getProjectById(projectMember.projectId)
        if (!Project) {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        }

        const existingProjectMember = await this._projectMemberRepo.findProjectAndUser(projectMember.projectId, projectMember.userId)
        if (existingProjectMember) {
            throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_ALREADY_EXISTS)
        }

        if (!projectMember.roleId) {
            throw new Error(PROJECT_ERRORS.PROJECT_ROLE_REQUIRED)
        }

        const role = await this._roleRepo.getRoleById(projectMember.roleId)
        if (!role) {
            throw new Error(PROJECT_ERRORS.PROJECT_ROLE_NOT_FOUND)
        }

        return await this._projectMemberRepo.addMemberToProject(projectMember)
    }
}
