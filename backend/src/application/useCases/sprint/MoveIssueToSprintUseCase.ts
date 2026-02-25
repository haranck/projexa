import { MoveIssueToSprintDTO } from "../../dtos/issue/requestDTOs/MoveIssueToSprintDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { IMoveIssueToSprintUseCase } from "../../interface/sprint/IMoveIssueToSprintUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { SPRINT_ERRORS } from "../../../domain/constants/errorMessages";
import { SprintStatus } from "../../../domain/enums/SprintStatus";


@injectable()
export class MoveIssueToSprintUseCase implements IMoveIssueToSprintUseCase {
    constructor(
        @inject('IIssueRepository') private readonly _issueRepository: IIssueRepository,
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository
    ) { }

    async execute(dto: MoveIssueToSprintDTO): Promise<IIssueEntity> {
        const issue = await this._issueRepository.findIssueById(dto.issueId)
        if (!issue) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)

        if (dto.sprintId) {
            const sprint = await this._sprintRepository.getSprintById(dto.sprintId)
            if (!sprint) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)

            if (sprint.projectId.toString() !== issue.projectId.toString()) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

            if (sprint.status === SprintStatus.COMPLETED) throw new Error(SPRINT_ERRORS.SPRINT_COMPLETED)
        }

        const updated = await this._issueRepository.updateIssue(issue._id.toString(), { sprintId: dto.sprintId })
        if (!updated) throw new Error(PROJECT_ERRORS.FAILED_TO_UPDATE_ISSUE)
        return updated
    }
}
