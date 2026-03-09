import { INotificationEntity } from "../../../entities/Notification/INotificationEntity";

export interface INotificationRepository {
    createNotification(notification: Partial<INotificationEntity>): Promise<INotificationEntity>;
    findByUser(userId: string): Promise<INotificationEntity[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}