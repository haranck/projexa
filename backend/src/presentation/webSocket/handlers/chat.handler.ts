import { Server, Socket } from "socket.io"
import { CHAT_EVENTS } from "../../../shared/constant/chat.events"
import { injectable, inject } from "tsyringe"
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { ISendMessageUseCase } from "../../../application/interface/chat/ISendMessageUseCase";
import { MessageDTO } from "../../../application/dtos/chat/requestDTOs/MessageDTO";
import { IGetMessagesUseCase } from "../../../application/interface/chat/IGetMessagesUseCase";

@injectable()
export class ChatHandler {

    constructor(
        @inject("ISendMessageUseCase") private readonly _sendMessageUseCase: ISendMessageUseCase,
        @inject("IGetMessagesUseCase") private readonly _getMessagesUseCase: IGetMessagesUseCase
    ) { }

    async handleJoinRoom(socket: Socket, roomId: string) {
        const roomName = `room:${roomId}`;
        socket.join(roomName);
        console.log(`User Joined Room ${roomName}`)
    }

    async handleSendMessage(data: MessageDTO): Promise<void> {
        try {
            await this._sendMessageUseCase.execute(data)
        } catch (error) {
            console.error("Error in handleSendMessage:", error);
        }
    }

    async handleTyping(socket: Socket, roomId: string) {
        const roomName = `room:${roomId}`;
        const userId = socket.handshake.auth?.userId;
        socket.to(roomName).emit(CHAT_EVENTS.TYPING, { roomId, userId });
    }

    async handleStopTyping(socket: Socket, roomId: string) {
        const roomName = `room:${roomId}`;
        const userId = socket.handshake.auth?.userId;
        socket.to(roomName).emit(CHAT_EVENTS.STOP_TYPING, { roomId, userId });
    }

    async handleGetHistory(socket: Socket, roomId: string) {
        try {
            const messages = await this._getMessagesUseCase.execute(roomId);
            socket.emit(CHAT_EVENTS.GET_HISTORY, messages);
        } catch (error) {
            console.error("Error in handleGetHistory:", error);
        }
    }

    static emitToRoom(io: Server, roomId: string, message: IMessageEntity) {
        const roomName = `room:${roomId}`
        io.to(roomName).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message)
    }
}