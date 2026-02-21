import { IssueType, IssueStatus } from "../../enums/IssueEnums";

export interface IAttachement {
    type: 'link' | 'file';
    url: string;
    fileName?: string;
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
    attachements?: IAttachement[];
    assigneeId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
