import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export const SprintStatus = {
    PLANNED: "PLANNED",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
} as const;

export type SprintStatus = typeof SprintStatus[keyof typeof SprintStatus];

export interface ISprintEntity {
    _id: string;
    projectId: string;
    workspaceId: string;
    name: string;
    status: SprintStatus;
    startDate?: string;
    endDate?: string;
    goal?: string;
}

export interface CreateSprintProps {
    projectId: string;
    workspaceId: string;
    createdBy?: string;
}

export interface StartSprintProps {
    sprintId: string;
    startDate: string;
    endDate: string;
    goal?: string;
}

export interface MoveIssueToSprintProps {
    issueId: string;
    sprintId: string;
}

export interface CompleteSprintProps {
    sprintId: string;
    moveIncompleteIssuesToSprintId?: string;
}

export const moveIssueToSprint = async (data: MoveIssueToSprintProps) => {
    const response = await AxiosInstance.patch(API_ROUTES.SPRINT.MOVE_ISSUE_TO_SPRINT.replace(":issueId", data.issueId), { sprintId: data.sprintId });
    return response.data;
};

export const createSprint = async (data: CreateSprintProps) => {
    const response = await AxiosInstance.post(API_ROUTES.SPRINT.CREATE_SPRINT, data);
    return response.data;
}

export const deleteSprint = async (sprintId: string) => {
    const response = await AxiosInstance.delete(API_ROUTES.SPRINT.DELETE_SPRINT.replace(":sprintId", sprintId));
    return response.data;
}

export const startSprint = async (data: StartSprintProps) => {
    const response = await AxiosInstance.patch(API_ROUTES.SPRINT.START_SPRINT.replace(":sprintId", data.sprintId), data);
    return response.data;
}
export const getSprintsByProjectId = async (projectId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.SPRINT.GET_SPRINTS.replace(":projectId", projectId));
    return response.data;
}

export const completeSprint = async (data: CompleteSprintProps) => {
    const response = await AxiosInstance.patch(API_ROUTES.SPRINT.COMPLETE_SPRINT.replace(":sprintId", data.sprintId), data);
    return response.data;
}