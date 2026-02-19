import mongoose, { Types, Document } from "mongoose";

export interface ProjectDocument extends Document {
    projectName: string;
    key: string;
    description: string;
    workspaceId: Types.ObjectId;
    members: {
        userId: Types.ObjectId;
        roleId: Types.ObjectId;
        joinedAt: Date;
    }[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

}

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    key: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    workspaceId: {
        type: Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    members: [
        {
            userId: {
                type: Types.ObjectId,
                ref: 'User',
                required: true
            },
            roleId: {
                type: Types.ObjectId,
                ref: 'Role',
                required: true
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })

ProjectSchema.index(
    { workspaceId: 1, key: 1 },
    { unique: true }
);

export const ProjectModel = mongoose.model<ProjectDocument>("Project", ProjectSchema);
