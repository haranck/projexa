import { injectable, inject } from "tsyringe";
import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";
import { INotificationRepository } from "../../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { INotificationService } from "../../../domain/interfaces/services/INotificationService";

@injectable()
export class SendNotificationUseCase implements ISendNotificationUseCase {
    constructor(
        @inject("INotificationRepository") private readonly notificationRepository: INotificationRepository,
        @inject("INotificationService") private readonly notificationService: INotificationService
    ) {}

    async execute(data: Partial<INotificationEntity>): Promise<INotificationEntity> {
        console.log(`[SendNotificationUseCase] Creating notification for recipient: ${data.recipientId}`);
        const notification = await this.notificationRepository.createNotification({
            ...data,
            isRead: false
        })
        console.log(`[SendNotificationUseCase] Notification created in DB with ID: ${notification._id}`);

        if (notification.recipientId) {
            console.log(`[SendNotificationUseCase] Emitting notification via Socket to: ${notification.recipientId}`);
            await this.notificationService.emitToUser(notification.recipientId.toString(), notification);
            console.log(`[SendNotificationUseCase] Emission call completed for: ${notification.recipientId}`);
        } else {
            console.warn(`[SendNotificationUseCase] Cannot emit notification: recipientId is missing.`);
        }

        return notification;
    }
}
