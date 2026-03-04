import { ICreateProjectUseCase } from "../../interface/project/ICreateProjectUseCase";
import { injectable, inject } from "tsyringe";
import { IProjectRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { CreateProjectDTO } from "../../dtos/project/requestDTOs/CreateProjectDTO";
import { IProjectEntity } from "../../../domain/entities/Project/IProjectEntity";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
    constructor(
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(project: CreateProjectDTO): Promise<IProjectEntity> {
        const existingProject = await this._projectRepo.getProjectByKey(project.workspaceId, project.key)
        if (existingProject) throw new Error(PROJECT_ERRORS.PROJECT_ALREADY_EXISTS)

        const createdProject = await this._projectRepo.createProject(project)

        const projectManager = await this._roleRepo.getRoleByName(ProjectRole.PROJECT_MANAGER)
        if (!projectManager) throw new Error(PROJECT_ERRORS.PROJECT_ROLE_NOT_FOUND)

        await this._projectMemberRepo.addMemberToProject({
            projectId: createdProject._id!,
            userId: project.createdBy,
            roleId: projectManager._id!
        })

        await this._sendNotificationUseCase.execute({
            recipientId: project.createdBy,
            eventType: NotificationEventType.PROJECT_CREATED,
            message: `Project "${createdProject.projectName}" created successfully`,
            resourceId: createdProject._id,
            resourceType: 'project'
        });

        if (project.members && project.members.length > 0) {
            for (const member of project.members) {
                await this._projectMemberRepo.addMemberToProject({
                    projectId: createdProject._id!,
                    userId: member.userId,
                    roleId: member.roleId
                })

                await this._sendNotificationUseCase.execute({
                    recipientId: member.userId,
                    senderId: project.createdBy,
                    eventType: NotificationEventType.PROJECT_MEMBER_ADDED,
                    message: `You were added to project "${createdProject.projectName}"`,
                    resourceId: createdProject._id,
                    resourceType: 'project'
                });
            }
        }

        return createdProject
    }
}
