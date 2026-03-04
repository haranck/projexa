import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";

export interface IGetNotificationUseCase {
    execute(userId: string): Promise<INotificationEntity[]>;
}