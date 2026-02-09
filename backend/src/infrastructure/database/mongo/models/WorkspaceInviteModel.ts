import mongoose, { Schema, Document, Types } from "mongoose";

export interface WorkspaceInviteDocument extends Document {

    workspaceId: Types.ObjectId;
    email: string;
    role: "MEMBER";
    token: string;
    invitedBy: Types.ObjectId;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceInviteSchema = new Schema<WorkspaceInviteDocument>(
    {
        workspaceId: { type: Types.ObjectId, ref: "Workspace", required: true },
        email: { type: String, required: true },
        role: { type: String, enum: ["MEMBER"], default: "MEMBER" },
        token: { type: String, required: true, unique: true },
        invitedBy: { type: Types.ObjectId, ref: "User", required: true },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, default: false }
    },
    { timestamps: true }
);

workspaceInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const WorkspaceInviteModel = mongoose.model("WorkspaceInvite", workspaceInviteSchema);
