import { injectable, inject } from "tsyringe";
import { INotificationRepository } from "../../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { IMarkAllNotificationsReadUseCase } from "../../interface/notification/IMarkAllNotificationsReadUseCase";

@injectable()
export class MarkAllNotificationsReadUseCase implements IMarkAllNotificationsReadUseCase {
    constructor(
        @inject("INotificationRepository") private readonly _notificationRepository: INotificationRepository
    ) {}

    async execute(userId: string): Promise<void> {
        await this._notificationRepository.markAllAsRead(userId);
    }
}
