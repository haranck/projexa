import { IssueType, IssueStatus } from "../../../../domain/enums/IssueEnums";
import { IAttachement } from "../../../../domain/entities/Issue/IIssueEntity";

export interface CreateIssueDTO {
    workspaceId: string;
    projectId: string;
    title: string;
    description?: string;
    issueType: IssueType;
    status?: IssueStatus;
    attachments?: IAttachement[];
    parentIssueId?: string | null;
    sprintId?: string | null;
    assigneeId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
}