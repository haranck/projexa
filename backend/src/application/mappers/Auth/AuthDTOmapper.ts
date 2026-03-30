import { IUserEntity } from "../../../domain/entities/IUserEntity";
import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";
import { GoogleLoginResponseDTO } from "../../dtos/auth/responseDTOs/GoogleLoginResponseDTO";

export class AuthDTOmapper {
    static toLoginResponseDTO(
        user: IUserEntity,
        accessToken: string,
        refreshToken: string,
        workspaces: IWorkspaceEntity[]
    ): LoginResponseDTO {
        const workspaceMap = workspaces.map(workspace => ({
            id: workspace._id!.toString(),
            name: workspace.name,
            ownerId: workspace.ownerId!
        }));

        return {
            accessToken,
            refreshToken,
            hasWorkspace: workspaces.length > 0,
            workspaces: workspaceMap,
            defaultWorkspace: workspaceMap.length > 0 ? workspaceMap[0] : null,
            user: {
                id: user._id!,
                firstName: user.firstName!,
                lastName: user.lastName!,
                email: user.email,
                phone: user.phone || "",
                isEmailVerified: user.isEmailVerified!,
                avatarUrl: user.avatarUrl,
            },
        };
    }

    static toGoogleLoginResponseDTO(
        user: IUserEntity,
        accessToken: string,
        refreshToken: string,
        workspaces: IWorkspaceEntity[]
    ): GoogleLoginResponseDTO {
        const workspaceMap = workspaces.map(workspace => ({
            id: workspace._id!.toString(),
            name: workspace.name,
            ownerId: workspace.ownerId!
        }));

        return {
            accessToken,
            refreshToken,
            hasWorkspace: workspaces.length > 0,
            workspaces: workspaceMap,
            defaultWorkspace: workspaceMap.length > 0 ? workspaceMap[0] : null,
            user: {
                id: user._id!,
                firstName: user.firstName!,
                lastName: user.lastName!,
                phone: user.phone || "",
                email: user.email,
                isEmailVerified: user.isEmailVerified!,
                avatarUrl: user.avatarUrl,
            },
        };
    }

    static toRefreshTokenResponseDTO(
        user: IUserEntity | { id: string; firstName: string; lastName: string; email: string; isEmailVerified: boolean },
        accessToken: string,
        refreshToken: string
    ): LoginResponseDTO {
        if ('id' in user && user.id === 'ADMIN') {
            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            } as LoginResponseDTO;
        }

        const u = user as IUserEntity;
        return {
            accessToken,
            refreshToken,
            user: {
                id: u._id!,
                firstName: u.firstName!,
                lastName: u.lastName!,
                email: u.email,
                isEmailVerified: u.isEmailVerified!
            }
        } as LoginResponseDTO;
    }
}
