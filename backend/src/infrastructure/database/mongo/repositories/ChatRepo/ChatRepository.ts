import { injectable } from "tsyringe";
import { IChatRepository } from "../../../../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { IChatRoomEntity } from "../../../../../domain/entities/Chat/IChatRoomEntity";
import { ChatDocument, ChatRoomModel } from "../../models/Chat/ChatRoomModel";
import { ChatRoomMapper } from "../../../../mappers/ChatRoomMapper";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";
import { CHAT_ERRORS } from "../../../../../domain/constants/errorMessages";

@injectable()
export class ChatRepository extends BaseRepo<IChatRoomEntity> implements IChatRepository {
    constructor() {
        super(ChatRoomModel as unknown as Model<IChatRoomEntity>);
    }

    async createRoom(room: Partial<IChatRoomEntity>): Promise<IChatRoomEntity> {
        const id = await super.create(room as IChatRoomEntity);
        const doc = await ChatRoomModel.findById(id);
        if (!doc) throw new Error(CHAT_ERRORS.CHAT_NOT_FOUND);
        return ChatRoomMapper.toEntity(doc as ChatDocument);
    }

    async getRoomByProjectId(projectId: string): Promise<IChatRoomEntity | null> {
        const doc = await ChatRoomModel.findOne({ projectId });
        if (!doc) return null;
        return ChatRoomMapper.toEntity(doc as ChatDocument);
    }

    async updateLastMessage(roomId: string, messageId: string): Promise<void> {
        await ChatRoomModel.findByIdAndUpdate(roomId, { lastMessage: messageId });
    }

    async findByRoomId(roomId:string):Promise<IChatRoomEntity | null>{
        const doc = await ChatRoomModel.findById(roomId);
        if (!doc) return null;
        return ChatRoomMapper.toEntity(doc as ChatDocument);
    }
}
