import { MoveIssueToSprintDTO } from "../../dtos/issue/requestDTOs/MoveIssueToSprintDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { IMoveIssueToSprintUseCase } from "../../../application/interface/Issue/IMoveIssueToSprintUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable,inject } from "tsyringe";

@injectable()
export class MoveIssueToSprintUseCase implements IMoveIssueToSprintUseCase {
    constructor(
        @inject('IIssueRepository') private readonly _issueRepository: IIssueRepository
    ){}

    async execute(dto: MoveIssueToSprintDTO): Promise<IIssueEntity> {
        const issue = await this._issueRepository.findIssueById(dto.issueId)
        if(!issue)throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)
        
        issue.sprintId = dto.sprintId
        
        const updatedIssue = await this._issueRepository.updateIssue(issue._id,{sprintId:dto.sprintId})

        if(!updatedIssue) throw new Error(PROJECT_ERRORS.FAILED_TO_UPDATE_ISSUE)

        return updatedIssue
    }
}
