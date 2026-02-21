export interface IProjectEntity {
    _id?: string;
    projectName: string;
    key: string;
    description: string;
    workspaceId: string;
    members?: {
        userId: string;
        roleId: string;
        joinedAt: Date;
        user?:{
            userName:string;
            profilePicture:string;
        }
    }[];
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}
