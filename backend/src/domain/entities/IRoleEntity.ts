import { Types } from "mongoose";

export interface IRoleEntity {
    _id?: Types.ObjectId;
    id?: string;
    name: string;
    permissions: string[];
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}