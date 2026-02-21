import { IssueType } from "../../../../domain/enums/IssueEnums";

export interface CreateIssueDTO {
    workspaceId: string;
    projectId: string;
    key:string;
    title: string;
    description?: string;
    issueType: IssueType;
    parentIssueId?: string | null;
    sprintId?: string | null;
    assigneeId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
}