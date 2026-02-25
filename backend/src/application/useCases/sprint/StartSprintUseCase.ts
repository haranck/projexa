import { injectable, inject } from "tsyringe";
import { IStartSprintUseCase } from "../../interface/sprint/IStartSprintUseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { StartSprintDTO } from "../../dtos/issue/requestDTOs/StartSprintDTO";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";
import { SprintStatus } from "../../../domain/enums/SprintStatus";
import { ERROR_MESSAGES, SPRINT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class StartSprintUseCase implements IStartSprintUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository
    ) { }
    async execute(dto: StartSprintDTO): Promise<ISprintEntity> {
        const sprint = await this._sprintRepository.getSprintById(dto.sprintId)
        if (!sprint) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)

        if (sprint.status === SprintStatus.ACTIVE) throw new Error(SPRINT_ERRORS.SPRINT_ALREADY_ACTIVE)
        if (sprint.status === SprintStatus.COMPLETED) throw new Error(SPRINT_ERRORS.SPRINT_COMPLETED)

        if (!dto.startDate || !dto.endDate) throw new Error(ERROR_MESSAGES.DATE_REQUIRED)

        if (dto.startDate > dto.endDate) throw new Error(ERROR_MESSAGES.INVALID_DATES)

        const updatedSprint = await this._sprintRepository.updateSprint(dto.sprintId, {
            status: SprintStatus.ACTIVE,
            startDate: dto.startDate,
            endDate: dto.endDate,
            goal: dto.goal
        })
        if (!updatedSprint) throw new Error(SPRINT_ERRORS.SPRINT_UPDATE_FAILED)

        return updatedSprint
    }
}