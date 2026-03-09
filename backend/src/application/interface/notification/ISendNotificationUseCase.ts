import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";

export interface ISendNotificationUseCase {
    execute(data: Partial<INotificationEntity>): Promise<INotificationEntity>;
} 