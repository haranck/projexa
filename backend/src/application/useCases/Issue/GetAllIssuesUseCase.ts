import { inject, injectable } from "tsyringe";
import { IGetAllIssuesUseCase } from "../../interface/Issue/IGetAllIssuesUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { GetAllIssuesFilterDTO } from "../../dtos/issue/requestDTOs/GetAllIssuesFilterDTO";

import { IssueDTOmapper } from "../../mappers/Issue/IssueDTOmapper";

@injectable()
export class GetAllIssuesUseCase implements IGetAllIssuesUseCase {
    constructor(
        @inject("IIssueRepository") private readonly _issueRepository: IIssueRepository
    ) { }

    async execute(filter :GetAllIssuesFilterDTO): Promise<IIssueEntity[]> {
        const issues = await this._issueRepository.getFilteredIssues(filter);
        return IssueDTOmapper.toResponseDTOs(issues);
    }
}
