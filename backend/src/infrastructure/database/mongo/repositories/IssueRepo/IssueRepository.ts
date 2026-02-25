import { IIssueRepository } from "../../../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { IssueDocument,IssueModel } from "../../models/Issue/IssueModel";
import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";
import { PROJECT_ERRORS } from "../../../../../domain/constants/errorMessages";
import { IIssueEntity } from "../../../../../domain/entities/Issue/IIssueEntity";
import { IssueMapper } from "../../../../mappers/IssueMapper";

@injectable()
export class IssueRepository extends BaseRepo<IIssueEntity> implements IIssueRepository {
    constructor() {
        super(IssueModel as unknown as Model<IIssueEntity>)
    }

    async createIssue(issue: Omit<IIssueEntity, "_id" | "createdAt" | "updatedAt">): Promise<IIssueEntity> {
        const id = await super.create(issue as IIssueEntity)
        const doc = await super.findById(id)
        if (!doc) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND);
        return IssueMapper.toEntity(doc as unknown as IssueDocument)
    }

    async updateIssue(issueId: string, updateData: Partial<Omit<IIssueEntity, "_id" | "createdAt" | "createdBy" | "updatedAt">>): Promise<IIssueEntity> {
        const doc = await super.update(updateData, issueId)
        if (!doc) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND);
        return IssueMapper.toEntity(doc as unknown as IssueDocument)
    }

    async deleteIssue(issueId:string):Promise<void>{
        await super.deleteById(issueId)
    }

    async findIssueById(issueId: string): Promise<IIssueEntity | null> {
        const doc = await super.findById(issueId)
        if(!doc) return null
        return IssueMapper.toEntity(doc as unknown as IssueDocument)
    }

    async findIssueByKey(key: string): Promise<IIssueEntity | null> {
        const doc = await IssueModel.findOne({key:key})
        if(!doc) return null
        return IssueMapper.toEntity(doc as unknown as IssueDocument)
    }

    async getIssuesByProjectId(projectId: string): Promise<IIssueEntity[]> {
        const docs = await IssueModel.find({ projectId: projectId })
        if (!docs) return []
        return docs.map(doc => IssueMapper.toEntity(doc as unknown as IssueDocument))
    }

    async countIssuesByAssignee(projectId: string, assigneeId: string): Promise<number> {
        const count = await IssueModel.countDocuments({ projectId, assigneeId });
        return count;
    }

    async removeSprintFromIssues(sprintId: string): Promise<void> {
        await IssueModel.updateMany({ sprintId: sprintId }, { $set: { sprintId: null } })
    }

    async getIssuesBySprintId(sprintId: string): Promise<IIssueEntity[]> {
        const docs = await IssueModel.find({ sprintId: sprintId })
        if (!docs) return []
        return docs.map(doc => IssueMapper.toEntity(doc as unknown as IssueDocument))
    }

    async updateSprint(issueId: string, sprintId: string | null): Promise<void> {
        await IssueModel.updateOne({ _id: issueId }, { $set: { sprintId: sprintId } })
    }
}



