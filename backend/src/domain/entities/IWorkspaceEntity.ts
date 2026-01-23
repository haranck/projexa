import { Types } from "mongoose";

export interface IWorkspaceEntity {
    _id?: Types.ObjectId;   
    name: string;
    description?: string;
    ownerId?: string;
    members?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}