export interface IProjectMemberEntity {
    _id?: string;
    projectId: string;
    userId: string;
    roleId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
