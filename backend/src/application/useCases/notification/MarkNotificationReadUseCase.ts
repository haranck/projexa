import { injectable, inject } from "tsyringe";
import { INotificationRepository } from "../../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { IMarkNotificationReadUseCase } from "../../interface/notification/IMarkNotificationReadUseCase";

@injectable()
export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase {
    constructor(
        @inject("INotificationRepository") private readonly _notificationRepository: INotificationRepository
    ) {}

    async execute(notificationId: string): Promise<void> {
        await this._notificationRepository.markAsRead(notificationId);
    }
}
