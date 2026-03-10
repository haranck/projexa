import { IMessageEntity } from "../../domain/entities/Chat/IMessageEntity";
import { MessageDTO } from "../dtos/chat/requestDTOs/MessageDTO";

export class MessageDTOmapper {
    static toDomain(data: MessageDTO): Omit<IMessageEntity, "_id" | "createdAt" | "updatedAt"> {
        return {
            roomId: data.roomId,
            senderId: data.senderId,
            messageType: data.messageType,
            content: data.content
        };
    }
}
