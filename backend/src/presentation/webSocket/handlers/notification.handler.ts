import { Server, Socket } from 'socket.io'
import { NOTIFICATION_EVENTS } from '../../../shared/constant/notification.events'
import { injectable, inject } from 'tsyringe'
import { ISendNotificationUseCase } from '../../../application/interface/notification/ISendNotificationUseCase'
import { INotificationEntity } from '../../../domain/entities/Notification/INotificationEntity'

@injectable()
export class NotificationHandler {
    private _socket!: Socket;
    private _io!: Server;

    constructor(
        @inject('ISendNotificationUseCase') private readonly _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async setSocket(socket: Socket, io: Server): Promise<void> {
        this._socket = socket;
        this._io = io;
    }

    async handleSendNotification(data: Partial<INotificationEntity>): Promise<void> {
        try {
            await this._sendNotificationUseCase.execute(data);
        } catch (error) {
            console.error("Error in handleSendNotification:", error);
        }
    }

    static emitToUser(io: Server, recipientId: string, notification: INotificationEntity) {
        const roomName = `user:${recipientId}`;
        io.to(roomName).emit(NOTIFICATION_EVENTS.RECEIVED, notification);
    }
}
