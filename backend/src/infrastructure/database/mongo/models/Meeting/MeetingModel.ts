import mongoose, { Schema, model, Document } from "mongoose";

export interface IMeetingParticipantDocument extends Document {
    userId: string;
    status: 'joined' | 'left' | 'missed';
    joinedAt?: Date;
    leftAt?: Date;
}

export interface IMeetingDocument extends Document {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    projectId: string;
    hostId: string;
    participants: IMeetingParticipantDocument[];
    status: 'upcoming' | 'completed' | 'cancelled';
    roomName: string;
    recordingUrl?: string;
    transcript?: string;
    summary?: string;
    summaryMetadata?: {
        actionItems: string[];
        decisions: string[];
    };
}

const ParticipantSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['invited', 'joined', 'left', 'missed'],
        default: 'invited'
    },
    joinedAt: { type: Date },
    leftAt: { type: Date }
}, { _id: false });

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [ParticipantSchema],
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    roomName: { type: String, required: true, unique: true },
    recordingUrl: { type: String, default: null },
    transcript: { type: String, default: null },
    summary: { type: String, default: null },
    summaryMetadata: {
        actionItems: [String],
        decisions: [String]
    }
}, { timestamps: true });

MeetingSchema.index({ projectId: 1 });
MeetingSchema.index({ startTime: 1 });

export const MeetingModel = model<IMeetingDocument>("Meeting", MeetingSchema);
