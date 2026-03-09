import { injectable,inject } from "tsyringe"
import { IDeleteSprintUseCase } from "../../interface/sprint/IDeleteSprintUseCase"
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository"
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository"
import { ERROR_MESSAGES, SPRINT_ERRORS } from "../../../domain/constants/errorMessages"
import { SprintStatus } from "../../../domain/enums/SprintStatus"

@injectable()
export class DeleteSprintUseCase implements IDeleteSprintUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository,
        @inject('IIssueRepository') private readonly _issueRepository: IIssueRepository
    ) { }
    async execute(sprintId: string): Promise<void> {

        const sprint = await this._sprintRepository.getSprintById(sprintId)
        if(!sprint){
            throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)
        }

        if(sprint.status === SprintStatus.ACTIVE){
            throw new Error(ERROR_MESSAGES.SPRINT_ACTIVE)
        }

        await this._issueRepository.removeSprintFromIssues(sprintId)
        await this._sprintRepository.deleteSprint(sprintId)
    }
}
