import mongoose, { Types, Document } from "mongoose";

export interface WorkspaceDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    ownerId: Types.ObjectId;
    members: Types.ObjectId[];
    subscriptionId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema<WorkspaceDocument>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        ownerId: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        members: {
            type: [Types.ObjectId],
            ref: "User",
            default: []
        },
        subscriptionId: {
            type: Types.ObjectId,
            ref: "Subscription",
            required: false
        }
    },
    { timestamps: true }
);

export const WorkspaceModel = mongoose.model<WorkspaceDocument>("Workspace", workspaceSchema);