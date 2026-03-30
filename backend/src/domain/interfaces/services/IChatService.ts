import { IMessageEntity } from "../../entities/Chat/IMessageEntity";

export interface IChatService {
    emitToRoom(roomId: string, message: IMessageEntity): void;
    emitReadUpdate(roomId: string, message: IMessageEntity): void;
}