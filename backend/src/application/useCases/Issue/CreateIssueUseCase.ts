import { CreateIssueDTO } from "../../dtos/issue/requestDTOs/CreateIssueDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { injectable, inject } from "tsyringe";
import { ICreateIssueUseCase } from "../../interface/Issue/ICreateIssueUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { PROJECT_ERRORS, ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { IssueDTOmapper } from "../../mappers/Issue/IssueDTOmapper";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { IssueType } from "../../../domain/enums/IssueEnums";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";


@injectable()
export class CreateIssueUseCase implements ICreateIssueUseCase {
    constructor(
        @inject("IIssueRepository") private _issueRepo: IIssueRepository,
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private _sendNotification: ISendNotificationUseCase
    ) { }

    async execute(dto: CreateIssueDTO, userId: string): Promise<IIssueEntity> {
        if (!dto.title.trim()) {
            throw new Error(PROJECT_ERRORS.ISSUE_INVALIDATION)
        }
        if (dto.issueType === IssueType.SUBTASK && !dto.parentIssueId) {
            throw new Error(PROJECT_ERRORS.NON_EPIC_ISSUE_WITHOUT_PARENT)
        }

        const project = await this._projectRepo.getProjectById(dto.projectId)
        if (!project) {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        }

        const projectMember = await this._projectMemberRepo.findProjectAndUser(dto.projectId, userId);
        if (!projectMember) {
            throw new Error(PROJECT_ERRORS.MEMBER_NOT_FOUND);
        }

        if (dto.issueType !== IssueType.SUBTASK) {
            const role = await this._roleRepo.getRoleById(projectMember.roleId);
            if (!role || role.name !== ProjectRole.PROJECT_MANAGER) {
                throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
            }
        }

        const nextNumber = await this._projectRepo.incrementIssueCounter(dto.projectId)
        const issueKey = `${project.key}-${nextNumber}`

        const issueData = IssueDTOmapper.toDomain(dto, userId, issueKey)

        const createdIssue = await this._issueRepo.createIssue(issueData)

        if (createdIssue.assigneeId) {
            await this._sendNotification.execute({
                recipientId: createdIssue.assigneeId,
                eventType: NotificationEventType.ISSUE_ASSIGNED,
                message: `Issue "${createdIssue.title}" has been assigned to you`,
                resourceId: createdIssue._id,
                resourceType: "issue"
            })
        }

        return IssueDTOmapper.toResponseDTO(createdIssue)
    }
}
