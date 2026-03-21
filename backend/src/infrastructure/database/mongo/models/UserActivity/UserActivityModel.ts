import mongoose, { Schema, Document } from "mongoose";
import { env } from "../../../../../config/envValidation";

export interface UserActivityDocument extends Document {
    userId: mongoose.Types.ObjectId;
    totalTime: number;
    lastUpdated: Date;
}

const UserActivitySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    totalTime: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now, index: { expires: env.USER_ACTIVITY_TTL } },
}, { timestamps: true });

export const UserActivityModel = mongoose.model<UserActivityDocument>("UserActivity", UserActivitySchema);
