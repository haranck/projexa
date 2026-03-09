import { injectable } from "tsyringe";
import { NotificationModel } from "../../models/Notification/NotificationModel";
import { INotificationEntity } from "../../../../../domain/entities/Notification/INotificationEntity";
import { INotificationRepository } from "../../../../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";
import { NOTIFICATION_ERRORS } from "../../../../../domain/constants/errorMessages";

@injectable()
export class NotificationRepository extends BaseRepo<INotificationEntity> implements INotificationRepository {
    constructor() {
        super(NotificationModel as unknown as Model<INotificationEntity>);
    }

    async createNotification(notification: Partial<INotificationEntity>): Promise<INotificationEntity> {
        const id = await super.create(notification as INotificationEntity)
        const doc = await super.findById(id)
        if (!doc) throw new Error(NOTIFICATION_ERRORS.NOTIFICATION_NOT_FOUND);
        return doc;
    }

    async findByUser(userId: string): Promise<INotificationEntity[]> {
        return await this.model.find({ recipientId: userId }).sort({ createdAt: -1 }).lean<INotificationEntity[]>();
    }

    async markAsRead(notificationId: string): Promise<void> {
        await super.update({ isRead: true }, notificationId);
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.model.updateMany({ recipientId: userId }, { isRead: true });
    }
}