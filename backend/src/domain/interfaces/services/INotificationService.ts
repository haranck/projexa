import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";

export interface INotificationService {
    emitToUser(userId: string, notification: INotificationEntity): void;
}