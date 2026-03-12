import { IMessageEntity } from "../../domain/entities/Chat/IMessageEntity";
import { MessageDocument } from "../database/mongo/models/Chat/MessageModel";

export class MessageMapper {
    static toEntity(doc: MessageDocument): IMessageEntity {
        return {
            _id: doc._id.toString(),
            roomId: doc.roomId.toString(),
            senderId: doc.senderId.toString(),
            messageType: doc.messageType,
            content: doc.content,
            isDeleted: doc.isDeleted,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}