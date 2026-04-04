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
        console.log(`[UpdateEpicUseCase] Executing for issueId: ${issueId}, userId: ${userId}`);
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

        const { comment, mentions: dtoMentions, ...updateData } = dto;
        const finalUpdateData: Partial<IIssueEntity> = { ...updateData };

        if (comment) {
            const user = await this._userRepo.findById(userId);
            
            const mentionRegex = /@([^@\s,.;:!?"]+)/g;
            const mentionMatches = comment.match(mentionRegex) || [];
            const mentions: string[] = dtoMentions || [];

            console.log(`[UpdateEpicUseCase] Comment: "${comment}"`);
            console.log(`[UpdateEpicUseCase] Found ${mentionMatches.length} mention matches from regex.`);
            console.log(`[UpdateEpicUseCase] DTO Mentions provided:`, dtoMentions);

            if (mentionMatches.length > 0 && (!dtoMentions || dtoMentions.length === 0)) {
                console.log(`[UpdateEpicUseCase] Parsing mentions from text...`);
                const projectMembers = await this._projectMemberRepo.findByProjectId(issue.projectId);
                const projectUserIds = projectMembers.map(m => m.userId);
                
                const projectUsers = await Promise.all(
                    projectUserIds.map(id => this._userRepo.findById(id))
                );
                
                for (const match of mentionMatches) {
                    const mentionName = match.substring(1).toLowerCase();
                    
                    const matchedUser = projectUsers.find(u => {
                        if (!u) return false;
                        const firstName = (u.firstName || "").toLowerCase().trim();
                        const lastName = (u.lastName || "").toLowerCase().trim();
                        const fullNameNoSpaces = (firstName + lastName).replace(/\s/g, "");
                        const fullNameNoSpacesReversed = (lastName + firstName).replace(/\s/g, "");
                        
                        return (firstName === mentionName) || 
                               (lastName === mentionName) || 
                               (fullNameNoSpaces === mentionName) ||
                               (fullNameNoSpacesReversed === mentionName);
                    });
                    
                    if (matchedUser && matchedUser._id) {
                        const userIdStr = matchedUser._id.toString();
                        if (!mentions.includes(userIdStr)) {
                            mentions.push(userIdStr);
                        }
                    }
                }
            }

            const newComment: IComment = {
                userId: userId,
                userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
                text: comment,
                mentions: mentions.length > 0 ? mentions : undefined,
                createdAt: new Date()
            };
            
            const existingComments = issue.comments || [];
            finalUpdateData.comments = [...existingComments, newComment];
        }

        const updatedIssue = await this._issueRepository.updateIssue(issueId, finalUpdateData)

        if (finalUpdateData.comments && finalUpdateData.comments.length > 0) {
            const lastComment = finalUpdateData.comments[finalUpdateData.comments.length - 1];
            if (lastComment.mentions && lastComment.mentions.length > 0) {
                const mentions = lastComment.mentions;
                console.log(`[UpdateEpicUseCase] Notifying ${mentions.length} mentioned users:`, mentions);
                for (const mentionedUserId of mentions) {
                    if (mentionedUserId.toString() !== userId.toString()) {
                        console.log(`[UpdateEpicUseCase] Sending mention notification to user: ${mentionedUserId}`);
                        await this._sendNotification.execute({
                            recipientId: mentionedUserId.toString(),
                            eventType: NotificationEventType.ISSUE_MENTIONED,
                            message: `${lastComment.userName} mentioned you in issue "${updatedIssue.title}"`,
                            resourceId: updatedIssue._id.toString(),
                            resourceType: "issue"
                        }).then(() => console.log(`[UpdateEpicUseCase] Notification sent successfully to: ${mentionedUserId}`))
                        .catch(err => console.error(`[UpdateEpicUseCase] Failed to send mention notification to ${mentionedUserId}:`, err));
                    } else {
                        console.log(`[UpdateEpicUseCase] Skipping notification for self-mention: ${userId}`);
                    }
                }
            } else {
                console.log(`[UpdateEpicUseCase] No mentions found in the last comment.`);
            }
        }

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
