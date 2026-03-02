import { injectable, inject } from "tsyringe";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { UpdateEpicDTO } from "../../dtos/issue/requestDTOs/UpdateEpicDTO";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IUpdateEpicUseCase } from "../../interface/Issue/IUpdateEpicUseCase";
import { PROJECT_ERRORS, ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class UpdateEpicUseCase implements IUpdateEpicUseCase {
    constructor(
        @inject('IIssueRepository') private _issueRepository: IIssueRepository,
        @inject('IProjectMemberRepository') private _projectMemberRepo: IProjectMemberRepository,
        @inject('IRoleRepository') private _roleRepo: IRoleRepository
    ) { }

    async execute(issueId: string, dto: UpdateEpicDTO, userId: string): Promise<IIssueEntity> {

        const issue = await this._issueRepository.findIssueById(issueId)
        if (!issue) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)

        let isProjectManager = false;

        const projectMember = await this._projectMemberRepo.findProjectAndUser(issue.projectId, userId);
        if (projectMember) {
            const role = await this._roleRepo.getRoleById(projectMember.roleId);
            if (role && role.name === ProjectRole.PROJECT_MANAGER) {
                isProjectManager = true;
            }
        }
        if (!isProjectManager) {
            if (issue.assigneeId?.toString() !== userId) {
                throw new Error(ERROR_MESSAGES.YOU_ARE_NOT_AUTHORIZED);
            }

            if (dto.assigneeId !== undefined && dto.assigneeId !== userId) {
                throw new Error(ERROR_MESSAGES.YOU_ARE_NOT_AUTHORIZED);
            }
        }
        if (dto.startDate && dto.endDate) {
            if (new Date(dto.startDate) > new Date(dto.endDate)) {
                throw new Error(PROJECT_ERRORS.INVALID_DATES)
            }
        }

        const updatedIssue = await this._issueRepository.updateIssue(issueId, dto)

        return updatedIssue
    }

}
