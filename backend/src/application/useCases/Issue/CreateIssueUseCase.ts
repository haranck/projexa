import { CreateIssueDTO } from "../../dtos/issue/requestDTOs/CreateIssueDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { injectable, inject } from "tsyringe";
import { ICreateIssueUseCase } from "../../interface/Issue/ICreateIssueUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IssueDTOmapper } from "../../mappers/IssueDTOmapper";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";


@injectable()
export class CreateIssueUseCase implements ICreateIssueUseCase {
    constructor(
        @inject("IssueRepository") private _issueRepo: IIssueRepository,
        @inject("IProjectRepository") private _projectRepo: IProjectRepository
    ) { }

    async execute(dto: CreateIssueDTO,userId:string): Promise<IIssueEntity> {
        if(!dto.title.trim()){
            throw new Error(PROJECT_ERRORS.ISSUE_INVALIDATION)
        }
        if(dto.issueType !== 'EPIC' && !dto.parentIssueId){
            throw new Error(PROJECT_ERRORS.NON_EPIC_ISSUE_WITHOUT_PARENT)
        }

        const project  = await this._projectRepo.getProjectById(dto.projectId)
        if(!project){
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        }
        const totalIssues = await this._issueRepo.getIssuesByProjectId(dto.projectId)
        const issueKey = `${project.key}-${totalIssues.length + 1}`

        const issueData = IssueDTOmapper.toDomain(dto,userId,issueKey)
        const createdIssue = await this._issueRepo.createIssue(issueData)
        return createdIssue 
    }
}