import { Server, Socket } from "socket.io";
import { NOTIFICATION_EVENTS } from "../../../shared/constant/notification.events";
import { NotificationHandler } from "../handlers/notification.handler";
import { notificationHandler } from "../../DI/resolver";

export class NotificationEvents {
    private _handler: NotificationHandler;

    constructor(private socket: Socket, private io: Server) {
        this._handler = notificationHandler;
        this._handler.setSocket(this.socket, this.io);
    }

    register() {
        this.socket.on(NOTIFICATION_EVENTS.SEND, (data) =>
            this._handler.handleSendNotification(data)
        );
    }
}