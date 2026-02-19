import { IWorkspaceInviteEntity } from "../../domain/entities/IWorkspaceInviteEntity";
import { WorkspaceInviteDocument } from "../database/mongo/models/WorkspaceInviteModel";
import { Types } from "mongoose";

export class WorkspaceInviteMapper {
    static toEntity(doc: WorkspaceInviteDocument): IWorkspaceInviteEntity {
        return {
            _id: doc._id.toString(),
            workspaceId: doc.workspaceId.toString(),
            email: doc.email,
            role: doc.role,
            token: doc.token,
            invitedBy: doc.invitedBy.toString(),
            expiresAt: doc.expiresAt,
            used: doc.used,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    static toPersistence(entity: Partial<IWorkspaceInviteEntity>): Partial<WorkspaceInviteDocument> {
        return {
            workspaceId: entity.workspaceId ? new Types.ObjectId(entity.workspaceId) : undefined as unknown as Types.ObjectId,
            email: entity.email,
            role: entity.role as "MEMBER",
            token: entity.token,
            invitedBy: entity.invitedBy ? new Types.ObjectId(entity.invitedBy) : undefined as unknown as Types.ObjectId,
            expiresAt: entity.expiresAt,
            used: entity.used
        };
    }
}
