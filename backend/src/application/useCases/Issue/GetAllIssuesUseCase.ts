import { inject, injectable } from "tsyringe";
import { IGetAllIssuesUseCase } from "../../interface/Issue/IGetAllIssuesUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";

@injectable()
export class GetAllIssuesUseCase implements IGetAllIssuesUseCase {
    constructor(
        @inject("IIssueRepository") private readonly _issueRepository: IIssueRepository
    ) { }

    async execute(projectId: string): Promise<IIssueEntity[]> {
        return await this._issueRepository.getIssuesByProjectId(projectId);
    }
}
