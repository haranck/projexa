import { MessageDocument, MessageModel } from "../../models/Chat/MessageModel";
import { injectable } from "tsyringe";
import { BaseRepo } from "../base/BaseRepo";
import { Model } from "mongoose";
import { IMessageRepository } from "../../../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { MessageMapper } from "../../../../mappers/MessageMapper";
import { IMessageEntity } from "../../../../../domain/entities/Chat/IMessageEntity";
import { CHAT_ERRORS } from "../../../../../domain/constants/errorMessages";

@injectable()
export class MessageRepository extends BaseRepo<IMessageEntity> implements IMessageRepository {
    constructor() {
        super(MessageModel as unknown as Model<IMessageEntity>)
    }

    async createMessage(message: Partial<IMessageEntity>): Promise<IMessageEntity> {
        const id = await super.create(message as IMessageEntity);
        const doc = await MessageModel.findById(id);
        if (!doc) throw new Error(CHAT_ERRORS.MESSAGE_NOT_FOUND);
        return MessageMapper.toEntity(doc as MessageDocument);
    }

    async findByRoom(roomId: string): Promise<IMessageEntity[]> {
        const docs = await MessageModel.find({ roomId }).sort({ createdAt: 1 });
        return docs.map(doc => MessageMapper.toEntity(doc as MessageDocument));
    }

    async deleteMessage(messageId: string): Promise<IMessageEntity> {
        const doc = await MessageModel.findByIdAndUpdate(
            messageId,
            { isDeleted: true, content: "This message was deleted" },
            { new: true }
        );
        if (!doc) throw new Error(CHAT_ERRORS.MESSAGE_NOT_FOUND);
        return MessageMapper.toEntity(doc as MessageDocument);
    }

    async findById(messageId: string): Promise<IMessageEntity | null> {
        const doc = await MessageModel.findById(messageId);
        return doc ? MessageMapper.toEntity(doc as MessageDocument) : null;
    }
}
