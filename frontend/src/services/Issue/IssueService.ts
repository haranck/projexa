import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export const IssueType = {
    EPIC: "EPIC",
    STORY: "STORY",
    TASK: "TASK",
    BUG: "BUG",
    SUBTASK: "SUBTASK",
} as const;
export type IssueType = typeof IssueType[keyof typeof IssueType];

export const IssueStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
} as const;
export type IssueStatus = typeof IssueStatus[keyof typeof IssueStatus];


export interface IAttachement {
    type: "link" | "file";
    url: string;
    fileName?: string;
}

export interface CreateIssueProps {
    workspaceId: string;
    projectId: string;
    title: string;
    description?: string;
    issueType: IssueType;
    status?: string;
    attachments?: IAttachement[];
    parentIssueId?: string | null;
    sprintId?: string | null;
    assigneeId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface UpdateEpicProps {
    epicId: string;
    title?: string;
    description?: string;
    status?: string;
    assigneeId?: string | null;
    attachments?: IAttachement[];
    startDate?: Date | null;
    endDate?: Date | null;
}


export const createIssue = async (data: CreateIssueProps) => {
    const response = await AxiosInstance.post(API_ROUTES.ISSUE.CREATE_ISSUE.replace(":projectId", data.projectId), data);
    return response.data;
};

export const getAllIssues = async (projectId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.ISSUE.GET_ALL_ISSUES.replace(":projectId", projectId));
    return response.data;
};

export const updateEpic = async (data: UpdateEpicProps) => {
    const response = await AxiosInstance.patch(API_ROUTES.ISSUE.UPDATE_ISSUE.replace(':issueId', data.epicId), data)
    return response.data
}

export const deleteIssue = async (issueId: string) => {
    const response = await AxiosInstance.delete(API_ROUTES.ISSUE.DELETE_ISSUE.replace(":issueId", issueId));
    return response.data;
};

export const getAttachmentUploadUrl = async (contentType: string) => {
    const response = await AxiosInstance.post(API_ROUTES.ISSUE.GET_ATTACHMENT_UPLOAD_URL, { contentType });
    return response.data;
};

export const uploadFileToS3 = async (presignedUrl: string, file: File): Promise<string> => {
    await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
    });
    return presignedUrl.split("?")[0];
};
