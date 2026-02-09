import mongoose, { Document, Types } from "mongoose";
import { SubscriptionStatus } from "../../../../domain/enums/SubscriptionStatus";

export interface SubscriptionDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    planId: Types.ObjectId;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<SubscriptionDocument>(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        workspaceId: {
            type: Types.ObjectId,
            ref: "Workspace",
            required: true
        },
        planId: {
            type: Types.ObjectId,
            ref: "Plan",
            required: true
        },
        stripeSubscriptionId: {
            type: String,
            required: false
        },
        stripeCustomerId: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: Object.values(SubscriptionStatus),
            default: SubscriptionStatus.ACTIVE
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export const SubscriptionModel = mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);
