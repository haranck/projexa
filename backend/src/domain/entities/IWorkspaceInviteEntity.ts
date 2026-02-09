import { Types } from "mongoose";

export interface IWorkspaceInviteEntity {
    _id?: Types.ObjectId;
    id: string;
    workspaceId: string;
    email: string;
    role: string;
    token: string;
    invitedBy: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}
