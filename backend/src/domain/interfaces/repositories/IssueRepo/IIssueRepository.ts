import { IIssueEntity } from "../../../entities/Issue/IIssueEntity";

export interface IIssueRepository {
    createIssue(issue: Omit<IIssueEntity, "_id" | "createdAt" | "updatedAt">): Promise<IIssueEntity>
    updateIssue(issueId: string, updateData: Partial<Omit<IIssueEntity, '_id' | 'createdAt' | 'createdBy' | 'updatedAt'>>): Promise<IIssueEntity>
    deleteIssue(issueId: string): Promise<void>
    findIssueById(issueId: string): Promise<IIssueEntity | null>
    findIssueByKey(key: string): Promise<IIssueEntity | null>
    getIssuesByProjectId(projectId: string): Promise<IIssueEntity[]>
    countIssuesByAssignee(projectId: string, assigneeId: string): Promise<number>
    removeSprintFromIssues(sprintId: string): Promise<void>
    getIssuesBySprintId(sprintId: string): Promise<IIssueEntity[]>;
    updateSprint(issueId: string, sprintId: string | null): Promise<void>;
}
