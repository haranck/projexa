import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";
import type { GetAllProjectsParams } from "../../types/project";

interface CreateProjectProps {
    projectName: string;
    key: string;
    description: string;
    workspaceId: string;
    members?: {
        userId: string;
        roleId: string;
    }[];
}

interface UpdateProjectProps {
    projectId: string;
    projectName: string;
    key: string;
    description: string;
}

interface AddProjectMemberProps {
    projectId: string;
    userId: string;
    roleId: string;
}


export const createProject = async (data: CreateProjectProps) => {
    const response = await AxiosInstance.post(API_ROUTES.PROJECTS.CREATE_PROJECT, data)
    return response.data;
}


export const getAllProjects = async ({ workspaceId, page = 1, limit = 5, search = '' }: GetAllProjectsParams) => {
    const response = await AxiosInstance.get(API_ROUTES.PROJECTS.GET_ALL_PROJECTS.replace(":workspaceId", workspaceId), {
        params: {
            page,
            limit,
            search
        }
    })
    return response.data;
}

export const updateProject = async (data: UpdateProjectProps) => {
    const response = await AxiosInstance.put(API_ROUTES.PROJECTS.UPDATE_PROJECT.replace(":projectId", data.projectId), data)
    return response.data;
}

export const deleteProject = async (projectId: string) => {
    const response = await AxiosInstance.delete(API_ROUTES.PROJECTS.DELETE_PROJECT.replace(":projectId", projectId))
    return response.data;
}

export const addProjectMember = async (data: AddProjectMemberProps) => {
    const response = await AxiosInstance.post(API_ROUTES.PROJECTS.ADD_PROJECT_MEMBER.replace(":projectId", data.projectId), data)
    return response.data;
}

export const removeProjectMember = async (data: { projectId: string, userId: string }) => {
    const response = await AxiosInstance.delete(API_ROUTES.PROJECTS.REMOVE_PROJECT_MEMBER
        .replace(":projectId", data.projectId)
        .replace(":userId", data.userId))
    return response.data;
}

export const updateProjectMemberRole = async (data: { projectId: string, userId: string, roleId: string }) => {
    const response = await AxiosInstance.patch(API_ROUTES.PROJECTS.UPDATE_PROJECT_MEMBER_ROLE.replace(":projectId", data.projectId), data)
    return response.data;
}
