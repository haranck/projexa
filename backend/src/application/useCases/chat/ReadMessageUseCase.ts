import { IReadMessageUseCase } from "../../interface/chat/IReadMessageUseCase";
import { injectable, inject } from "tsyringe";
import { IMessageRepository } from "../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { IChatService } from "../../../domain/interfaces/services/IChatService";
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";

@injectable()
export class ReadMessageUseCase implements IReadMessageUseCase {
    constructor(
        @inject("IMessageRepository") private readonly _messageRepository: IMessageRepository,
        @inject("IChatService") private readonly _chatService: IChatService
    ) { }

    async execute(messageId: string, userId: string): Promise<void> {
        const message = await this._messageRepository.findById(messageId);
        if (!message) return;

        // Add user to readBy list
        await this._messageRepository.updateReadBy(messageId, userId);

        // Emit update to the room
        this._chatService.emitReadUpdate(message.roomId, {
            ...message,
            readBy: [...(message.readBy || []), userId]
        } as IMessageEntity);
    }
}
