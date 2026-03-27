import { IUserEntity } from '../../../domain/entities/IUserEntity';
import { IRoleEntity } from '../../../domain/entities/IRoleEntity';
import { IWorkspaceEntity } from '../../../domain/entities/IWorkspaceEntity';
import { IPlanEntity } from '../../../domain/entities/IPlanEntity';
import { InvoiceDTO } from '../../dtos/user/requestDTOs/InvoiceDTO';

import { AcceptInviteResponseDTO } from '../../dtos/user/responseDTOs/AcceptInviteResponseDTO';
import { CompleteProfileResponseDTO } from '../../dtos/user/responseDTOs/CompleteProfileResponseDTO';
import { ProfileImageUploadUrlResponseDTO } from '../../dtos/user/responseDTOs/ProfileImageUploadUrlResponseDTO';
import { UpdateProfileImageResponseDTO } from '../../dtos/user/responseDTOs/UpdateProfileImageResponseDTO';
import { UpdateProfileResponseDTO } from '../../dtos/user/responseDTOs/UpdateProfileResponseDTO';
import { WorkspaceInvoicesResponseDTO } from '../../dtos/user/responseDTOs/WorkspaceInvoicesResponseDTO';
import { RoleResponseDTO } from '../../dtos/user/responseDTOs/RoleResponseDTO';
import { WorkspaceResponseDTO } from '../../dtos/user/responseDTOs/WorkspaceResponseDTO';
import { WorkspaceMemberResponseDTO } from '../../dtos/user/responseDTOs/WorkspaceMemberResponseDTO';
import { PlanResponseDTO } from '../../dtos/user/responseDTOs/PlanResponseDTO';

export class UserDTOmapper {
    static toAcceptInviteResponseDTO(
        user: IUserEntity,
        accessToken: string,
        refreshToken: string,
        workspaceId: string
    ): AcceptInviteResponseDTO {
        return {
            accessToken,
            refreshToken,
            workspaceId,
            user: {
                id: user._id!,
                _id: user._id!.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
            },
        };
    }


    static toCompleteProfileResponseDTO(user: IUserEntity): CompleteProfileResponseDTO {
        return {
            id: user._id!,
            _id: user._id!.toString(),
            email: user.email,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            isEmailVerified: user.isEmailVerified ?? false,
            onboardingCompleted: user.onboardingCompleted ?? false,
        };
    }


    static toRoleResponseDTO(role: IRoleEntity): RoleResponseDTO {
        return {
            id: role._id!,
            _id: role._id!.toString(),
            name: role.name,
            permissions: role.permissions,
            createdBy: role.createdBy,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }


    static toRoleListResponseDTO(roles: IRoleEntity[]): RoleResponseDTO[] {
        return roles.map(UserDTOmapper.toRoleResponseDTO);
    }


    static toWorkspaceResponseDTO(workspace: IWorkspaceEntity): WorkspaceResponseDTO {
        return {
            id: workspace._id ? workspace._id.toString() : "",
            _id: workspace._id ? workspace._id.toString() : "",
            name: workspace.name,
            description: workspace.description,
            ownerId: workspace.ownerId,
            members: workspace.members,
            planId: workspace.planId,
            subscriptionId: workspace.subscriptionId,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
        };
    }

    static toWorkspaceListResponseDTO(workspaces: IWorkspaceEntity[]): WorkspaceResponseDTO[] {
        return workspaces.map(UserDTOmapper.toWorkspaceResponseDTO);
    }

    static toWorkspaceMemberResponseDTO(member: IUserEntity): WorkspaceMemberResponseDTO {
        return {
            id: member._id!,
            _id: member._id!.toString(),
            email: member.email,
            firstName: member.firstName,
            lastName: member.lastName,
            avatarUrl: member.avatarUrl,
            phone: member.phone,
            isEmailVerified: member.isEmailVerified,
            onboardingCompleted: member.onboardingCompleted,
            lastSeenAt: member.lastSeenAt,
        };
    }


    static toWorkspaceMemberListResponseDTO(members: IUserEntity[]): WorkspaceMemberResponseDTO[] {
        return members.map(UserDTOmapper.toWorkspaceMemberResponseDTO);
    }


    static toPlanResponseDTO(plan: IPlanEntity): PlanResponseDTO {
        return {
            id: plan._id!,
            name: plan.name,
            price: plan.price,
            interval: plan.interval,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            features: plan.features,
            isActive: plan.isActive,
            stripePriceId: plan.stripePriceId,
        };
    }

    static toPlanListResponseDTO(plans: IPlanEntity[]): PlanResponseDTO[] {
        return plans.map(UserDTOmapper.toPlanResponseDTO);
    }

    static toWorkspaceInvoicesResponseDTO(
        workspaceId: string,
        invoices: InvoiceDTO[]
    ): WorkspaceInvoicesResponseDTO {
        return { workspaceId, invoices };
    }


    static toProfileImageUploadUrlResponseDTO(
        uploadUrl: string,
        imageUrl: string
    ): ProfileImageUploadUrlResponseDTO {
        return { uploadUrl, imageUrl };
    }


    static toUpdateProfileImageResponseDTO(
        message: string,
        avatarUrl: string
    ): UpdateProfileImageResponseDTO {
        return { message, avatarUrl };
    }

    static toUpdateProfileResponseDTO(
        message: string,
        userId: string,
        firstName: string,
        lastName: string,
        phone: string
    ): UpdateProfileResponseDTO {
        return {
            message,
            data: { userId, _id: userId, firstName, lastName, phone },
        };
    }

    static toCheckoutSessionResponseDTO(sessionUrl: string): { checkoutUrl: string } {
        return { checkoutUrl: sessionUrl };
    }
}
