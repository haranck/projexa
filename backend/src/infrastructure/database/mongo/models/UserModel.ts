import mongoose, { Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isBlocked: boolean;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    isBlocked: Boolean,
    avatarUrl: String,
    isEmailVerified: Boolean,
    lastSeenAt: Date,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
