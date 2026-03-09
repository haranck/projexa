import mongoose, { Types, Document } from "mongoose";
import { NotificationType } from "../../../../../domain/entities/Notification/INotificationEntity";
import { NotificationEventType } from "../../../../../domain/enums/NotificationEventType";

export interface NotificationDocument extends Document {
    recipientId: Types.ObjectId;
    senderId?: Types.ObjectId;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: NotificationType;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    eventType: {
        type: String,
        enum: NotificationEventType,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        required: false
    },
    resourceType: {
        type: String,
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true })

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', NotificationSchema);