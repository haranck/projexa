export interface IRoleEntity {
    _id?: string;
    name: string;
    permissions: string[];
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}