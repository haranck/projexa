import mongoose, { Document } from 'mongoose'
import { SprintStatus } from '../../../../../domain/enums/SprintStatus'

export interface SprintDocument extends Document {
    workspaceId: string;
    projectId: string;
    name: string;
    goal?: string;
    status: SprintStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const sprintSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true,
        index: true
    },
    projectId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(SprintStatus),
        default: SprintStatus.PLANNED
    },
    startDate: {
        type: Date,
        required: false,
        default: null
    },
    endDate: {
        type: Date,
        required: false,
        default: null
    },
    createdBy: {
        type: String,
        required: true,
    }
}, { timestamps: true })

sprintSchema.index({ workspaceId: 1, projectId: 1 });
sprintSchema.index({ workspaceId: 1, projectId: 1, status: 1 });

export const SprintModel = mongoose.model<SprintDocument>("Sprint", sprintSchema)