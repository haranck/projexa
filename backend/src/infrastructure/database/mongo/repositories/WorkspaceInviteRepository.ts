import { IWorkspaceInviteRepository } from "../../../../domain/interfaces/repositories/IWorkspaceInviteRepository";
import { BaseRepo } from "./base/BaseRepo";
import { Model } from "mongoose";
import { IWorkspaceInviteEntity } from "../../../../domain/entities/IWorkspaceInviteEntity";
import { WorkspaceInviteModel } from "../models/WorkspaceInviteModel";

export class WorkspaceInviteRepository extends BaseRepo<IWorkspaceInviteEntity> implements IWorkspaceInviteRepository {
    constructor() {
        super(WorkspaceInviteModel as unknown as Model<IWorkspaceInviteEntity>)
    }
    async createInvite(workspaceInvite: IWorkspaceInviteEntity): Promise<IWorkspaceInviteEntity> {
        const doc = await super.create({
            workspaceId: workspaceInvite.workspaceId,
            email: workspaceInvite.email,
            role: workspaceInvite.role,
            token: workspaceInvite.token,
            invitedBy: workspaceInvite.invitedBy,
            expiresAt: workspaceInvite.expiresAt,
            used: workspaceInvite.used,
            createdAt: workspaceInvite.createdAt,
            updatedAt: workspaceInvite.updatedAt,
        } as IWorkspaceInviteEntity)
        const createdDoc = await super.findById(doc)
        if (!createdDoc) throw new Error("Invite creation failed")
        return createdDoc
    }
    async getWorkspacesByUserId(userId: string): Promise<IWorkspaceInviteEntity[]> {
        const docs = await this.model.find({
            $or: [
                { ownerId: userId },
                { members: userId }
            ]
        }).populate({
            path: 'subscriptionId',
            populate: {
                path: 'planId'
            }
        });

        return docs;
    }
    async findByToken(token: string): Promise<IWorkspaceInviteEntity | null> {
        const doc = await this.model.findOne({ token });
        return doc;
    }
    async markAsUsed(inviteId: string): Promise<void> {
        const doc = await this.model.findByIdAndUpdate(inviteId, { used: true });
        if (!doc) throw new Error("Invite not found");
    }
    async findValidInvite(workspaceId: string, email: string): Promise<IWorkspaceInviteEntity | null> {
        const doc = await this.model.findOne({ workspaceId, email, used: false });
        return doc;
    }
}