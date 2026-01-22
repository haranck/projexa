import mongoose, { Document, Types } from "mongoose";
import { PlanInterval } from "../../../../domain/enums/PlanInterval";

export interface PlanDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    price: number;
    interval: PlanInterval;
    maxMembers: number;
    maxProjects: number;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new mongoose.Schema<PlanDocument>(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        interval: {
            type: String,
            enum: Object.values(PlanInterval),
            required: true
        },
        maxMembers: {
            type: Number,
            required: true
        },
        maxProjects: {
            type: Number,
            required: true
        },
        features: {
            type: [String],
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const PlanModel = mongoose.model<PlanDocument>("Plan", planSchema);