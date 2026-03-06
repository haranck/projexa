import { injectable, inject } from "tsyringe"
import { ICreateSprintUseCase } from "../../interface/sprint/ICreateSprintuseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { CreateSprintDTO } from "../../dtos/issue/requestDTOs/CreateSprintDTO";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { SprintMapper } from "../../mappers/SprintMapper";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class CreateSprintUseCase implements ICreateSprintUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository,
        @inject('IProjectRepository') private readonly _projectRepository: IProjectRepository,
        @inject('IProjectMemberRepository') private readonly _projectMemberRepo: IProjectMemberRepository,
        @inject('IRoleRepository') private readonly _roleRepo: IRoleRepository,
    ) { }

    async execute(dto: CreateSprintDTO, userId: string): Promise<ISprintEntity> {
        const project = await this._projectRepository.getProjectById(dto.projectId)
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

        const projectMember = await this._projectMemberRepo.findProjectAndUser(dto.projectId, userId);
        if (!projectMember) throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_NOT_FOUND);

        const role = await this._roleRepo.getRoleById(projectMember.roleId);

        if (!role || role.name !== ProjectRole.PROJECT_MANAGER) {
            throw new Error(PROJECT_ERRORS.ONLY_PROJECT_MANAGER_CAN_CREATE_SPRINT);
        }

        const sprintCount = await this._sprintRepository.countByProjectId(dto.projectId)

        const nextNumber = sprintCount + 1
        const sprintName = `${project.key}-Sprint-${nextNumber}`

        const sprintData = SprintMapper.toDomain(dto, sprintName);

        const sprint = await this._sprintRepository.createSprint(sprintData)
        return sprint;
    }
}
