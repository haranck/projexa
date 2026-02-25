import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";
import { SprintDocument,SprintModel } from "../../models/Sprint/SprintModel";
import { ISprintRepository } from "../../../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { SprintMapper } from "../../../../mappers/SprintMapper";
import { ISprintEntity } from "../../../../../domain/entities/Sprint/ISprintEntity";
import { SPRINT_ERRORS } from "../../../../../domain/constants/errorMessages";

@injectable()
export class SprintRepository extends BaseRepo<ISprintEntity> implements ISprintRepository {
    constructor() {
        super(SprintModel as unknown as Model<ISprintEntity>)
    }

    async createSprint(sprintData: ISprintEntity): Promise<ISprintEntity> {
        const id = await super.create(sprintData as ISprintEntity)
        const doc = await super.findById(id)
        if (!doc) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND);
        return SprintMapper.toEntity(doc as unknown as SprintDocument)
    }

    async getSprintById(sprintId: string): Promise<ISprintEntity | null> {
        const doc = await super.findById(sprintId)
        return doc ? SprintMapper.toEntity(doc as unknown as SprintDocument) : null
    }

    async getSprintsByProjectId(projectId: string): Promise<ISprintEntity[]> {
        const docs = await SprintModel.find({ projectId: projectId })
        return docs.map(doc => SprintMapper.toEntity(doc as unknown as SprintDocument))
    }

    async updateSprint(sprintId: string, sprintData: Partial<ISprintEntity>): Promise<ISprintEntity | null> {
        const doc = await super.update(sprintData,sprintId)
        return doc ? SprintMapper.toEntity(doc as unknown as SprintDocument) : null
    }

    async deleteSprint(sprintId: string): Promise<boolean> {
        const doc = await super.deleteById(sprintId)
        return !!doc
    }

    async getSprintsByWorkspaceId(workspaceId: string): Promise<ISprintEntity[]> {
        const docs = await SprintModel.find({ workspaceId: workspaceId })
        return docs.map(doc => SprintMapper.toEntity(doc as unknown as SprintDocument))
    }

    async countByProjectId(projectId: string): Promise<number> {
        const count = await SprintModel.countDocuments({ projectId })
        return count
    }
}
