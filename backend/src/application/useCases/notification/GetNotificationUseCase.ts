import { injectable, inject } from "tsyringe";
import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";
import { INotificationRepository } from "../../../domain/interfaces/repositories/NotificationRepo/INotificationRepository";
import { IGetNotificationUseCase } from "../../interface/notification/IGetNotificationUseCase";

@injectable()
export class GetNotificationUseCase implements IGetNotificationUseCase {
    constructor(
        @inject("INotificationRepository") private readonly notificationRepository: INotificationRepository
    ) {}

    async execute(userId: string): Promise<INotificationEntity[]> {
        return await this.notificationRepository.findByUser(userId);
    }
}