export interface CreateWorkspaceDTO {
    name: string;
    description?: string;
    ownerId: string;
    members?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}