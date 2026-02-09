import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IWorkspaceEntity } from "../../../../domain/entities/IWorkspaceEntity";
import { injectable } from "tsyringe";
import { BaseRepo } from "./base/BaseRepo";
import { WorkspaceModel } from "../models/WorkspaceModel";
import { Model } from "mongoose";
import { WORKSPACE_ERRORS } from "../../../../domain/constants/errorMessages";

@injectable()
export class WorkspaceRepository extends BaseRepo<IWorkspaceEntity> implements IWorkspaceRepository {

    constructor() {
        super(WorkspaceModel as unknown as Model<IWorkspaceEntity>);
    }

    async createWorkspace(workspace: IWorkspaceEntity): Promise<IWorkspaceEntity> {
        const id = await super.create({
            name: workspace.name,
            ownerId: workspace.ownerId,
            description: workspace.description || "",
            members: workspace.members,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
        })
        const createdDoc = await super.findById(id);
        if (!createdDoc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_CREATION_FAILED);
        return createdDoc;
    }

    async getWorkspaceById(id: string): Promise<IWorkspaceEntity | null> {
        const doc = await super.findById(id);
        if (!doc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);
        return doc;
    }

    async getWorkspaceByOwnerId(ownerId: string): Promise<IWorkspaceEntity | null> {
        const doc = await this.model.findOne({ ownerId });
        if (!doc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);
        return doc;
    }

    async getWorkspaceByName(name: string): Promise<IWorkspaceEntity | null> {
        const doc = await this.model.findOne({ name });
        if (!doc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);
        return doc;
    }

    async updateWorkspace(id: string, workspace: IWorkspaceEntity): Promise<IWorkspaceEntity> {
        const doc = await this.model.findByIdAndUpdate(id, workspace, { new: true });
        if (!doc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);
        return doc;
    }

    async getWorkspacesByUserId(userId: string): Promise<IWorkspaceEntity[]> {
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

}