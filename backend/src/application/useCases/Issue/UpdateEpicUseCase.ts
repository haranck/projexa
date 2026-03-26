import { injectable, inject } from "tsyringe";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { UpdateEpicDTO } from "../../dtos/issue/requestDTOs/UpdateEpicDTO";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IUpdateEpicUseCase } from "../../interface/Issue/IUpdateEpicUseCase";
import { PROJECT_ERRORS, ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IComment } from "../../../domain/entities/Issue/IIssueEntity";

import { IssueDTOmapper } from "../../mappers/Issue/IssueDTOmapper";

@injectable()
export class UpdateEpicUseCase implements IUpdateEpicUseCase {
    constructor(
        @inject('IIssueRepository') private _issueRepository: IIssueRepository,
        @inject('IProjectMemberRepository') private _projectMemberRepo: IProjectMemberRepository,
        @inject('IRoleRepository') private _roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private _sendNotification: ISendNotificationUseCase,
        @inject('IUserRepository') private _userRepo: IUserRepository
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

        const { comment, ...updateData } = dto;
        const finalUpdateData: Partial<IIssueEntity> = { ...updateData };

        if (comment) {
            const user = await this._userRepo.findById(userId);
            const newComment: IComment = {
                userId: userId,
                userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
                text: comment,
                createdAt: new Date()
            };
            
            const existingComments = issue.comments || [];
            finalUpdateData.comments = [...existingComments, newComment];
        }

        const updatedIssue = await this._issueRepository.updateIssue(issueId, finalUpdateData)

        if (dto.assigneeId && dto.assigneeId !== issue.assigneeId) {
            await this._sendNotification.execute({
                recipientId: dto.assigneeId,
                eventType: NotificationEventType.ISSUE_ASSIGNED,
                message: `Issue "${updatedIssue.title}" has been assigned to you`,
                resourceId: updatedIssue._id,
                resourceType: "issue"
            }).catch(err => console.error("Failed to send assignment notification:", err));
        }

        return IssueDTOmapper.toResponseDTO(updatedIssue);
    }

}
