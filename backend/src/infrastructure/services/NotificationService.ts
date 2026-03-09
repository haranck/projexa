import { injectable } from "tsyringe";
import { INotificationService } from "../../domain/interfaces/services/INotificationService";
import { INotificationEntity } from "../../domain/entities/Notification/INotificationEntity";
import { getIO } from "../../presentation/webSocket/server/socketServer";
import { NotificationHandler } from "../../presentation/webSocket/handlers/notification.handler";

@injectable()
export class NotificationService implements INotificationService {

    emitToUser(userId: string, notification: INotificationEntity): void {

        NotificationHandler.emitToUser(
            getIO(),
            userId,
            notification
        );

    }

}