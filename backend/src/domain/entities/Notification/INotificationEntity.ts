import { NotificationEventType } from "../../enums/NotificationEventType";

export interface INotificationEntity {
    _id?: string;
    recipientId: string;
    senderId?: string;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: NotificationType;
    isRead: boolean;
    createdAt?: Date;
}

export type NotificationType = 'issue' | 'sprint' | 'project';
