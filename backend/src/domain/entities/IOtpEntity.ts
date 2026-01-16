import type { Types } from "mongoose";
export interface IOtpEntity {
    _id?: Types.ObjectId;
    userId: string;
    code: string;
    expiresAt: Date;
    isUsed: boolean;
    createdAt: Date;
}