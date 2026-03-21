import { Server, Socket } from "socket.io"
import { CHAT_EVENTS } from "../../../shared/constant/chat.events"
import { injectable, inject } from "tsyringe"
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { ISendMessageUseCase } from "../../../application/interface/chat/ISendMessageUseCase";
import { MessageDTO } from "../../../application/dtos/chat/requestDTOs/MessageDTO";
import { IGetMessagesUseCase } from "../../../application/interface/chat/IGetMessagesUseCase";
import { IDeleteMessageUseCase } from "../../../application/interface/chat/IDeleteMessageUseCase";
import { IReadMessageUseCase } from "../../../application/interface/chat/IReadMessageUseCase";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { redisClient } from "../../../infrastructure/cache/redisClient";

@injectable()
export class ChatHandler {

    constructor(
        @inject("ISendMessageUseCase") private readonly _sendMessageUseCase: ISendMessageUseCase,
        @inject("IGetMessagesUseCase") private readonly _getMessagesUseCase: IGetMessagesUseCase,
        @inject("IDeleteMessageUseCase") private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
        @inject("IReadMessageUseCase") private readonly _readMessageUseCase: IReadMessageUseCase,
        @inject("IProjectMemberRepository") private readonly _projectMemberRepository: IProjectMemberRepository,
    ) { }

    async handleJoinRoom(socket: Socket, roomId: string) {
        const roomName = `room:${roomId}`;
        socket.join(roomName);
        socket.join(`project:${roomId}`);
        console.log(`User Joined Room ${roomName} and project:${roomId}`)
    }

    async handleSendMessage(data: MessageDTO): Promise<void> {
        try {
            await this._sendMessageUseCase.execute(data)
        } catch (error) {
            console.error("Error in handleSendMessage:", error);
        }
    }

    async handleTyping(socket: Socket, data: string | { roomId: string, projectId?: string }) {
        const roomId = typeof data === 'string' ? data : data.roomId;
        const projectId = typeof data === 'object' ? data.projectId : null;
        const userId = socket.handshake.auth?.userId;

        socket.to(`room:${roomId}`).emit(CHAT_EVENTS.TYPING, { roomId, userId, projectId });
        if (projectId) {
            socket.to(`project:${projectId}`).emit(CHAT_EVENTS.TYPING, { roomId, userId, projectId });
        }
    }

    async handleStopTyping(socket: Socket, data: string | { roomId: string, projectId?: string }) {
        const roomId = typeof data === 'string' ? data : data.roomId;
        const projectId = typeof data === 'object' ? data.projectId : null;
        const userId = socket.handshake.auth?.userId;

        socket.to(`room:${roomId}`).emit(CHAT_EVENTS.STOP_TYPING, { roomId, userId, projectId });
        if (projectId) {
            socket.to(`project:${projectId}`).emit(CHAT_EVENTS.STOP_TYPING, { roomId, userId, projectId });
        }
    }

    async handleGetHistory(socket: Socket, roomId: string) {
        try {
            const messages = await this._getMessagesUseCase.execute(roomId);
            socket.emit(CHAT_EVENTS.GET_HISTORY, messages);
        } catch (error) {
            console.error("Error in handleGetHistory:", error);
        }
    }
    async handleDeleteMessage(socket: Socket, messageId: string) {
        try {
            const requesterId = socket.handshake.auth?.userId;
            if (!requesterId) {
                socket.emit("error", "Unauthorized");
                return;
            }
            await this._deleteMessageUseCase.execute(messageId, requesterId);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to delete message";
            socket.emit("error", message);
        }
    }

    async handleReadMessage(socket:Socket,messageId:string) {
        const requesterId = socket.handshake.auth?.userId;
        if (!requesterId) {
            socket.emit("error", "Unauthorized");
            return;
        }
        await this._readMessageUseCase.execute(messageId, requesterId);
    }

    async handleGetOnlineUsers(socket: Socket, projectId: string) {
        try {
            const members = await this._projectMemberRepository.findByProjectId(projectId);
            const onlineUsers: string[] = [];

            for (const member of members) {
                const isOnline = await redisClient.get(`online:${member.userId}`);
                if (isOnline) {
                    onlineUsers.push(member.userId.toString());
                }
            }

            socket.emit(CHAT_EVENTS.ONLINE_USERS_LIST, onlineUsers);
        } catch (error) {
            console.error("Error in handleGetOnlineUsers:", error);
        }
    }

    static emitToRoom(io: Server, roomId: string, message: IMessageEntity) {
        const roomName = `room:${roomId}`
        io.to(roomName).emit(CHAT_EVENTS.RECEIVE_MESSAGE, message)
    }

    static emitReadUpdate(io: Server, roomId: string, message: IMessageEntity) {
        const roomName = `room:${roomId}`
        io.to(roomName).emit(CHAT_EVENTS.READ_UPDATE, message)
    }
}