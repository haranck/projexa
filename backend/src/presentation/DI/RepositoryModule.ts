import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { UserRepository } from "../../infrastructure/database/mongo/repositories/UserRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OtpRedisRepository } from "../../infrastructure/database/mongo/repositories/OtpRedisRepository";
import { ITokenBlacklistRepository } from "../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { RedisTokenBlacklistRepository } from "../../infrastructure/database/mongo/repositories/RedisTokenBlacklistRepository";
import { IPlanRepository } from "../../domain/interfaces/repositories/IPlanRepository";
import { PlanRepository } from "../../infrastructure/database/mongo/repositories/PlanRepository";
import { IWorkspaceRedisRepository } from "../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { WorkspaceRedisRepository } from "../../infrastructure/database/mongo/repositories/WorkspaceRedisRepository";
import { IWorkspaceInviteRepository } from "../../domain/interfaces/repositories/IWorkspaceInviteRepository";
import { WorkspaceInviteRepository } from "../../infrastructure/database/mongo/repositories/WorkspaceInviteRepository";
import { IRoleRepository } from "../../domain/interfaces/repositories/IRoleRepository";
import { RoleRepository } from "../../infrastructure/database/mongo/repositories/RoleRepository";
import { IProjectRepository } from "../../domain/interfaces/repositories/ProjectRepo/IProjectRepository";
import { ProjectRepository } from "../../infrastructure/database/mongo/repositories/ProjectRepo/ProjectRepository";
import { IProjectMemberRepository } from "../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { ProjectMemberRepository } from "../../infrastructure/database/mongo/repositories/ProjectRepo/ProjectMemberRepository";
import { IIssueRepository } from "../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IssueRepository } from "../../infrastructure/database/mongo/repositories/IssueRepo/IssueRepository";
import { ISprintRepository } from "../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { SprintRepository } from "../../infrastructure/database/mongo/repositories/Sprint/SprintRepository";
import { INotificationRepository } from "../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { NotificationRepository } from "../../infrastructure/database/mongo/repositories/NotificationRepo/NotificationRepository";
import { IChatRepository } from "../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { ChatRepository } from "../../infrastructure/database/mongo/repositories/ChatRepo/ChatRepository";
import { IMessageRepository } from "../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { MessageRepository } from "../../infrastructure/database/mongo/repositories/ChatRepo/MessageRepository";
import { IDashboardRepository } from "../../domain/interfaces/repositories/DashboardRepo/IDashboardRepository";
import { DashboardRepository } from "../../infrastructure/database/mongo/repositories/DashboardRepo/DashboardRepository";
import { IUserActivityRepository } from "../../domain/interfaces/repositories/UserActivity/IUserActivityRepository";
import { UserActivityRepository } from "../../infrastructure/database/mongo/repositories/UserActivity/UserActivityRepository";
import { IMeetingRepository } from "../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { MeetingRepository } from "../../infrastructure/database/mongo/repositories/MeetingRepo/MeetingRepository";

export class RepositoryModule {
    static registerModules(): void {

        container.register<IUserRepository>('IUserRepository', {
            useClass: UserRepository
        });

        container.register<IOtpRepository>('IOtpRepository', {
            useClass: OtpRedisRepository
        })

        container.register<ITokenBlacklistRepository>('ITokenBlacklistRepository', {
            useClass: RedisTokenBlacklistRepository
        })

        container.register<IPlanRepository>('IPlanRepository', {
            useClass: PlanRepository
        })

        container.register<IWorkspaceRedisRepository>('IWorkspaceRedisRepository', {
            useClass: WorkspaceRedisRepository
        })

        container.register<IWorkspaceInviteRepository>('IWorkspaceInviteRepository', {
            useClass: WorkspaceInviteRepository
        })

        container.register<IRoleRepository>('IRoleRepository', {
            useClass: RoleRepository
        })

        container.register<IProjectRepository>('IProjectRepository', {
            useClass: ProjectRepository
        })

        container.register<IProjectMemberRepository>('IProjectMemberRepository', {
            useClass: ProjectMemberRepository
        })

        container.register<IIssueRepository>('IIssueRepository', {
            useClass: IssueRepository
        })

        container.register<ISprintRepository>('ISprintRepository', {
            useClass: SprintRepository
        })

        container.register<INotificationRepository>('INotificationRepository', {
            useClass: NotificationRepository
        })

        container.register<IChatRepository>('IChatRepository', {
            useClass: ChatRepository
        })

        container.register<IMessageRepository>('IMessageRepository', {
            useClass: MessageRepository
        })

        container.register<IDashboardRepository>("IDashboardRepository", {
            useClass: DashboardRepository
        });
        container.register<IUserActivityRepository>("IUserActivityRepository", {
            useClass: UserActivityRepository
        });
        container.register<IMeetingRepository>("IMeetingRepository", {
            useClass: MeetingRepository
        });
    }
}
