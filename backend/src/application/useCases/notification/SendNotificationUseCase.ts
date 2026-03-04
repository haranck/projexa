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

        const notification = await this.notificationRepository.createNotification({
            ...data,
            isRead: false
        })

        this.notificationService.emitToUser(notification.recipientId.toString(), notification);

        return notification;
    }
}
