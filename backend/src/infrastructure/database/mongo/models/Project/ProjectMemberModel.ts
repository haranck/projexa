import mongoose, { Types, Document } from "mongoose";

export interface ProjectMemberDocument extends Document {
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    roleId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectMemberSchema = new mongoose.Schema({
    projectId: {
        type: Types.ObjectId,
        ref: 'Project',
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    roleId: {
        type: Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, { timestamps: true })

ProjectMemberSchema.index(
    { projectId: 1, userId: 1 },
    { unique: true }
);

export const ProjectMemberModel = mongoose.model<ProjectMemberDocument>("ProjectMember", ProjectMemberSchema);
