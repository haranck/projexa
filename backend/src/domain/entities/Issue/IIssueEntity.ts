import { IssueType, IssueStatus } from "../../enums/IssueEnums";

export interface IAttachement {
    type: 'link' | 'file';
    url: string;
    fileName?: string;
}

export interface IComment {
    userId: string;
    userName: string;
    text: string;
    mentions?: string[];
    createdAt: Date;
}

export interface IIssueEntity {
    _id: string;
    workspaceId: string;
    projectId: string;
    parentIssueId?: string | null;
    sprintId?: string | null;
    key: string;
    title: string;
    description?: string;
    issueType: IssueType;
    status: IssueStatus;
    attachments?: IAttachement[];
    assigneeId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    comments?: IComment[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
