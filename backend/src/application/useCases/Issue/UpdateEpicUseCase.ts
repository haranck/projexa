import { injectable,inject } from "tsyringe";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { UpdateEpicDTO } from "../../dtos/issue/requestDTOs/UpdateEpicDTO";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IUpdateEpicUseCase } from "../../interface/Issue/IUpdateEpicUseCase";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class UpdateEpicUseCase implements IUpdateEpicUseCase {
    constructor(
        @inject('IIssueRepository') private _issueRepository:IIssueRepository
    ){}

    async execute(issueId:string,dto:UpdateEpicDTO):Promise<IIssueEntity>{
        const issue = await this._issueRepository.findIssueById(issueId)
        if (!issue) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)

        if(dto.startDate && dto.endDate){
            if(dto.startDate > dto.endDate) throw new Error(PROJECT_ERRORS.INVALID_DATES)
        }

        const updatedIssue = await this._issueRepository.updateIssue(issueId,dto)

        return updatedIssue
    }
}