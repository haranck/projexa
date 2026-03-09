export interface ProjectMember {
    userId: string;
    roleId: string;
    joinedAt: string | Date;
    user?: {
        userName: string;
        profilePicture: string;
    }
}

export interface Project {
    _id: string;
    projectName: string;
    description: string;
    key: string;
    workspaceId: string;
    members: ProjectMember[];
    createdBy: string;
    createdAt: string | Date;
    updatedAt: string | Date;
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

