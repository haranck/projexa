import { Server, Socket } from "socket.io"
import { CHAT_EVENTS } from "../../../shared/constant/chat.events"
import { injectable, inject } from "tsyringe"
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { ISendMessageUseCase } from "../../../application/interface/chat/ISendMessageUseCase";
import { MessageDTO } from "../../../application/dtos/chat/requestDTOs/MessageDTO";

@injectable()
export class ChatHandler {
    private _socket!: Socket;
    private _io!: Server;

    constructor(
        @inject("ISendMessageUseCase") private readonly _sendMessageUseCase: ISendMessageUseCase
    ) { }

    async setSocket(socket: Socket, io: Server) {
        this._socket = socket;
        this._io = io;
    }

    async handleJoinRoom(roomId: string) {
        const roomName = `room:${roomId}`;
        this._socket.join(roomName);
        console.log(`User Joined Room ${roomName}`)
    }

    async handleSendMessage(data: MessageDTO): Promise<void> {
        try {
            await this._sendMessageUseCase.execute(data)
        } catch (error) {
            console.error("Error in handleSendMessage:", error);
        }
    }

    async handleTyping(roomId: string) {
        const roomName = `room:${roomId}`;
        const userId = this._socket.handshake.auth?.userId;
        this._socket.to(roomName).emit(CHAT_EVENTS.TYPING, { roomId, userId });
    }

    async handleStopTyping(roomId: string) {
        const roomName = `room:${roomId}`;
        const userId = this._socket.handshake.auth?.userId;
        this._socket.to(roomName).emit(CHAT_EVENTS.STOP_TYPING, { roomId, userId });
    }

    static emitToRoom(io: Server, roomId: string, message: IMessageEntity) {
        const roomName = `room:${roomId}`
        io.to(roomName).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message)
    }
}