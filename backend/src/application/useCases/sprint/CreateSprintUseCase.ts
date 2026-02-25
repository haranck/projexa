import { injectable, inject } from "tsyringe"
import { ICreateSprintUseCase } from "../../interface/sprint/ICreateSprintuseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { CreateSprintDTO } from "../../dtos/issue/requestDTOs/CreateSprintDTO";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { SprintMapper } from "../../mappers/SprintMapper";

@injectable()
export class CreateSprintUseCase implements ICreateSprintUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository,
        @inject('IProjectRepository') private readonly _projectRepository: IProjectRepository
    ) { }

    async execute(dto: CreateSprintDTO): Promise<ISprintEntity> {
        const project = await this._projectRepository.getProjectById(dto.projectId)
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

        const sprintCount = await this._sprintRepository.countByProjectId(dto.projectId)

        const nextNumber = sprintCount + 1
        const sprintName = `${project.key}-Sprint-${nextNumber}`

        const sprintData = SprintMapper.toDomain(dto, sprintName);

        const sprint = await this._sprintRepository.createSprint(sprintData)
        return sprint;
    }
}
