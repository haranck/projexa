import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { UserRepository } from "../../infrastructure/database/mongo/repositories/UserRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OtpRepository } from "../../infrastructure/database/mongo/repositories/OtpRepository";
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

export class RepositoryModule {
    static registerModules(): void {

        container.register<IUserRepository>('IUserRepository', {
            useClass: UserRepository
        });

        container.register<IOtpRepository>('IOtpRepository', {
            useClass: OtpRepository
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
    }
}
