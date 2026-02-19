export interface IWorkspaceEntity {
    _id?: string;
    name: string;
    description?: string;
    ownerId?: string;
    members?: string[];
    planId?: string;
    subscriptionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}