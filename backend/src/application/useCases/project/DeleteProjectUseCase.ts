import { injectable, inject } from "tsyringe";
import { IDeleteProjectUseCase } from "../../interface/project/IDeleteProjectUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";

import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";

@injectable()
export class DeleteProjectUseCase implements IDeleteProjectUseCase {
    constructor(
        @inject("IProjectRepository") private readonly _projectRepository: IProjectRepository,
        @inject("IProjectMemberRepository") private readonly _projectMemberRepository: IProjectMemberRepository,
        @inject("ISendNotificationUseCase") private readonly _sendNotification: ISendNotificationUseCase,
        @inject("IRoleRepository") private readonly _roleRepo: IRoleRepository
    ) { }

    async execute(projectId: string, requesterId: string): Promise<void> {
        const project = await this._projectRepository.getProjectById(projectId);
        if (!project) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND);

        const requesterMember = await this._projectMemberRepository.findProjectAndUser(projectId, requesterId);
        if (!requesterMember) throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_DELETE_PROJECT);

        const requesterRole = await this._roleRepo.getRoleById(requesterMember.roleId);
        if (!requesterRole || requesterRole.name !== ProjectRole.PROJECT_MANAGER) {
            throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_DELETE_PROJECT);
        }

        const projectMembers = await this._projectMemberRepository.findByProjectId(projectId);

        await this._projectRepository.deleteProject(projectId);

        const notificationPromises = projectMembers.map((member: IProjectMemberEntity) =>
            this._sendNotification.execute({
                recipientId: member.userId,
                eventType: NotificationEventType.PROJECT_DELETED,
                message: `Project "${project.projectName}" has been deleted`,
                resourceId: projectId,
                resourceType: "project"
            }).catch(err => console.error(`Failed to send notification to ${member.userId}:`, err))
        );

        await Promise.all(notificationPromises);
    }
}
