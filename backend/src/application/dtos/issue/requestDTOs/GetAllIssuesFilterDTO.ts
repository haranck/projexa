export interface GetAllIssuesFilterDTO {
    projectId: string;
    assigneeId?: string;
    issueType?: string;
    sprintId?: string | null;
    dateFilter?: "RECENT" | "DUE_SOON";
}