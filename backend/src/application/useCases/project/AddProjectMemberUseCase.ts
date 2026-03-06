import { injectable, inject } from "tsyringe";
import { AddProjectMemberDTO } from "../../dtos/project/requestDTOs/AddProjectMemberDTO"
import { IProjectMemberEntity } from "../../../domain/entities/Project/IProjectMemberEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { IAddProjectMemberUseCase } from "../../interface/project/IAddProjectMemberUseCase";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";

@injectable()
export class AddProjectMemberUseCase implements IAddProjectMemberUseCase {
    constructor(
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository,
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
        @inject("ISendNotificationUseCase") private _sendNotification: ISendNotificationUseCase,
    ) { }

    async execute(data: AddProjectMemberDTO, requesterId: string): Promise<IProjectMemberEntity> {
        const project = await this._projectRepo.getProjectById(data.projectId)
        if (!project) {
            throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)
        }

        const callerMember = await this._projectMemberRepo.findProjectAndUser(data.projectId, requesterId);
        if (callerMember) {
            const role = await this._roleRepo.getRoleById(callerMember.roleId);
            if (role && role.name !== ProjectRole.PROJECT_MANAGER) {
                throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_ADD_PROJECT_MEMBER);
            }
        }

        const existingProjectMember = await this._projectMemberRepo.findProjectAndUser(data.projectId, data.userId)
        if (existingProjectMember) {
            throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_ALREADY_EXISTS)
        }

        if (!data.roleId) {
            throw new Error(PROJECT_ERRORS.PROJECT_ROLE_REQUIRED)
        }

        const role = await this._roleRepo.getRoleById(data.roleId)
        if (!role) {
            throw new Error(PROJECT_ERRORS.PROJECT_ROLE_NOT_FOUND)
        }

        const createdMember = await this._projectMemberRepo.addMemberToProject(data);


        await this._sendNotification.execute({
            recipientId: data.userId,
            eventType: NotificationEventType.PROJECT_MEMBER_ADDED,
            message: `You have been added to project "${project.projectName}"`,
            resourceId: data.projectId,
            resourceType: "project"
        }).catch(err => console.error("Failed to send project member addition notification:", err));

        return createdMember;
    }
}
