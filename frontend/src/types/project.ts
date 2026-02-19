export interface Project {
    _id: string;
    projectName: string;
    description: string;
    key: string;
    workspaceId: string;
    members: {
        userId: string;
        roleId: string;
        joinedAt: string;
    }[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetAllProjectsResponse {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetAllProjectsParams {
    workspaceId: string;
    page?: number;
    limit?: number;
    search?: string;
}

