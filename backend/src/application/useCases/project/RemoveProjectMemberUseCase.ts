import { injectable, inject } from "tsyringe"
import { IRemoveProjectMemberUseCase } from "../../interface/project/IRemoveProjectMemberUseCase";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class RemoveProjectMemberUseCase implements IRemoveProjectMemberUseCase {
    constructor(
        @inject("IProjectMemberRepository") private readonly _projectMemberRepository: IProjectMemberRepository,
        @inject('IProjectRepository') private readonly _projectRepository: IProjectRepository,
        @inject("IIssueRepository") private readonly _issueRepository: IIssueRepository,
        @inject("ISendNotificationUseCase") private readonly _sendNotificationUseCase: ISendNotificationUseCase,
        @inject("IRoleRepository") private readonly _roleRepo: IRoleRepository
    ) { }

    async execute(data: { projectId: string; userId: string }, requesterId: string): Promise<void> {
        const project = await this._projectRepository.getProjectById(data.projectId)
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

        const requesterMember = await this._projectMemberRepository.findProjectAndUser(data.projectId, requesterId);
        if (!requesterMember) throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_REMOVE_PROJECT_MEMBER);

        const requesterRole = await this._roleRepo.getRoleById(requesterMember.roleId);
        if (!requesterRole || requesterRole.name !== ProjectRole.PROJECT_MANAGER) {
            throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_REMOVE_PROJECT_MEMBER);
        }

        if (project.createdBy.toString() === data.userId.toString()) throw new Error(PROJECT_ERRORS.CANNOT_REMOVE_CREATOR)

        const projectMember = await this._projectMemberRepository.findProjectAndUser(data.projectId, data.userId)
        if (!projectMember) throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_NOT_FOUND)

        const assignedIssuesCount = await this._issueRepository.countIssuesByAssignee(data.projectId, data.userId);
        if (assignedIssuesCount > 0) {
            throw new Error(PROJECT_ERRORS.CANNOT_REMOVE_MEMBER_HAS_ISSUES);
        }

        await this._projectMemberRepository.removeMember(projectMember._id!)

        await this._sendNotificationUseCase.execute({
            recipientId: data.userId,
            eventType: NotificationEventType.PROJECT_MEMBER_REMOVED,
            message: `You have been removed from project "${project.projectName}"`,
            resourceId: data.projectId,
            resourceType: 'project'
        })
    }
}
