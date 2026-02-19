import { IWorkspaceInviteEntity } from "../../entities/IWorkspaceInviteEntity";

export interface IWorkspaceInviteRepository {
    createInvite(workspaceInvite: IWorkspaceInviteEntity): Promise<IWorkspaceInviteEntity>;
    findByToken(token: string): Promise<IWorkspaceInviteEntity | null>;
    markAsUsed(inviteId: string): Promise<void>;
    findValidInvite(workspaceId: string, email: string): Promise<IWorkspaceInviteEntity | null>;
}