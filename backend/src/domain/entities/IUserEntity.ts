import type { Types } from "mongoose";

export interface IUserEntity {
  _id?: Types.ObjectId;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
