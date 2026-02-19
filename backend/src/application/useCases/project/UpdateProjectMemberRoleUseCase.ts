import { injectable, inject } from "tsyringe";
import { IUpdateProjectMemberRoleUseCase } from "../../interface/project/IUpdateProjectMemberRoleUseCase";
import { UpdateProjectMemberRoleDTO } from "../../dtos/project/requestDTOs/UpdateProjectMemberRoleDTO";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";

@injectable()
export class UpdateProjectMemberRoleUseCase implements IUpdateProjectMemberRoleUseCase {
    constructor(
        @inject("IProjectRepository") private _projectRepository: IProjectRepository,
        @inject("IProjectMemberRepository") private _projectMemberRepository: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepository: IRoleRepository
    ) { }
    async execute(data: UpdateProjectMemberRoleDTO): Promise<IProjectMemberEntity> {
        if (!data.userId || !data.roleId || !data.projectId) {
            throw new Error(PROJECT_ERRORS.INVALID_DATA);
        }

        const project = await this._projectRepository.getProjectById(data.projectId);
        if (!project) {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);
        }
        const role = await this._roleRepository.getRoleById(data.roleId);
        if (!role) {
            throw new Error(PROJECT_ERRORS.ROLE_NOT_FOUND);
        }

        return await this._projectMemberRepository.updateProjectMemberRole(data);
    }
}
 