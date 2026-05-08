import mongoose, { Schema, model, Document } from "mongoose";
import { MeetingSummaryStatus } from "../../../../../domain/enums/MeetingSummaryStatus";

export interface IActionItemDocument {
    task: string;
    assignee?: string;
    dueDate?: string;
}

export interface IMeetingSummaryDocument extends Document {
    meetingId: string;
    transcript?: string;
    summary?: string;
    keyPoints: string[];
    decisions: string[];
    actionItems: IActionItemDocument[];
    status: MeetingSummaryStatus;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ActionItemSchema = new Schema<IActionItemDocument>(
    {
        task: { type: String, required: true },
        assignee: { type: String },
        dueDate: { type: String },
    },
    { _id: false }
);

const MeetingSummarySchema = new mongoose.Schema<IMeetingSummaryDocument>(
    {
        meetingId: { type: String, required: true, unique: true, index: true },
        transcript: { type: String },
        summary: { type: String },
        keyPoints: { type: [String], default: [] },
        decisions: { type: [String], default: [] },
        actionItems: { type: [ActionItemSchema], default: [] },
        status: {
            type: String,
            enum: Object.values(MeetingSummaryStatus),
            default: MeetingSummaryStatus.PENDING,
        },
        errorMessage: { type: String },
    },
    { timestamps: true }
);

export const MeetingSummaryModel = model<IMeetingSummaryDocument>(
    "MeetingSummary",
    MeetingSummarySchema
);
