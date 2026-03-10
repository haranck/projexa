import { IChatRoomEntity } from "../../domain/entities/Chat/IChatRoomEntity";
import { ChatDocument } from "../database/mongo/models/Chat/ChatRoomModel";

export class ChatRoomMapper {
    static toEntity(doc: ChatDocument): IChatRoomEntity {
        return {
            _id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            members: doc.members.map((member) => member.toString()),
            lastMessage: doc.lastMessage?.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}

