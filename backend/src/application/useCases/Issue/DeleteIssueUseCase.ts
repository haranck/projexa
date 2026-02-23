import { IDeleteIssueUseCase } from "../../interface/Issue/IDeleteIssueUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { injectable, inject } from "tsyringe";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class DeleteIssueUseCase implements IDeleteIssueUseCase {
    constructor(
        @inject('IIssueRepository') private readonly _issueRepository: IIssueRepository,
        @inject('IProjectMemberRepository') private readonly _projectMemberRepository: IProjectMemberRepository
    ) { }

    async execute(issueId: string, userId: string): Promise<void> {
        const issue = await this._issueRepository.findIssueById(issueId)
        if (!issue) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)

        const member = await this._projectMemberRepository.findProjectAndUser(issue.projectId, userId)
        if (!member) throw new Error(PROJECT_ERRORS.MEMBER_NOT_FOUND)

        const isCreator = issue.createdBy === userId
        const projectManager = member.roleId === ProjectRole.PROJECT_MANAGER

        if (!isCreator && !projectManager) throw new Error(PROJECT_ERRORS.NOT_AUTHORIZED)

        const projectIssues = await this._issueRepository.getIssuesByProjectId(issue.projectId)
        const children = projectIssues.filter(i => i.parentIssueId === issueId)

        for (const child of children) {
            await this._issueRepository.updateIssue(child._id, { parentIssueId: null })
        }

        await this._issueRepository.deleteIssue(issueId)
    }
}

