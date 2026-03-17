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
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { IChatRepository } from "../../../domain/interfaces/repositories/ChatRepo/IChatRepository";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
    constructor(
        @inject("IProjectRepository") private _projectRepo: IProjectRepository,
        @inject("IProjectMemberRepository") private _projectMemberRepo: IProjectMemberRepository,
        @inject("IRoleRepository") private _roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private _sendNotificationUseCase: ISendNotificationUseCase,
        @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository,
        @inject("IChatRepository") private _chatRepository: IChatRepository,
    ) { }

    async execute(project: CreateProjectDTO): Promise<IProjectEntity> {
        const workspace = await this._workspaceRepository.getWorkspaceById(project.workspaceId)
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)

        if (workspace.ownerId?.toString() !== project.createdBy) throw new Error(PROJECT_ERRORS.UNAUTHORIZED_TO_CREATE_PROJECT)

        const existingProject = await this._projectRepo.getProjectByKey(project.workspaceId, project.key)
        if (existingProject) throw new Error(PROJECT_ERRORS.PROJECT_ALREADY_EXISTS)

        const createdProject = await this._projectRepo.createProject(project)

        const chatMembers = [
            project.createdBy,
            ...(project.members?.map(m=>m.userId)||[])
        ]

        await this._chatRepository.createRoom({
            projectId:createdProject._id!,
            members:chatMembers
        })

        const projectManager = await this._roleRepo.getRoleByName(ProjectRole.PROJECT_MANAGER)
        if (!projectManager) throw new Error(PROJECT_ERRORS.PROJECT_ROLE_NOT_FOUND)

        await this._projectMemberRepo.addMemberToProject({
            projectId: createdProject._id!,
            userId: project.createdBy,
            roleId: projectManager._id!
        })

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
