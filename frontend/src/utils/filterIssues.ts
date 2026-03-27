export interface IssueItem {
    _id: string;
    key: string;
    title: string;
    description?: string;
    issueType: string;
    status: string;
    assigneeId?: string | null;
    parentIssueId?: string | null;
    sprintId?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    workspaceId: string;
    projectId: string;
    createdBy: string;
    attachments?: { type: string; url: string; fileName?: string }[];
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    estimate?: string;
}

export interface IssueFilters {
    assigneeId?: string | null;
    issueType?: string | null;
    parentIssueId?: string | null;
    sprintId?: string | string[] | null;
    searchQuery?: string;
    dateFilter?: "RECENT" | "DUE_SOON" | null;
}

export const filterIssues = (
    issues: IssueItem[],
    filters: IssueFilters
) => {
    return issues.filter(issue => {
        if (filters.searchQuery && !issue.title.toLowerCase().includes(filters.searchQuery.toLowerCase()))
            return false;

        if (filters.assigneeId && issue.assigneeId !== filters.assigneeId)
            return false;

        if (filters.issueType && issue.issueType !== filters.issueType)
            return false;

        if (filters.parentIssueId && issue.parentIssueId !== filters.parentIssueId)
            return false;

        if (filters.sprintId) {
            if (Array.isArray(filters.sprintId)) {
                if (filters.sprintId.length > 0 && (!issue.sprintId || !filters.sprintId.includes(issue.sprintId))) {
                    return false;
                }
            } else {
                if (issue.sprintId !== filters.sprintId) {
                    return false;
                }
            }
        }

        if (filters.dateFilter === "RECENT") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (new Date(issue.createdAt) < sevenDaysAgo)
                return false;
        }

        if (filters.dateFilter === "DUE_SOON") {
            const threeDays = new Date();
            threeDays.setDate(threeDays.getDate() + 3);
            if (!issue.endDate || new Date(issue.endDate) > threeDays)
                return false;
        }

        return true;
    });
};
