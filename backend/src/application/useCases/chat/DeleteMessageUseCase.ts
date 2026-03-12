import { injectable, inject } from "tsyringe";
import { IDeleteMessageUseCase } from "../../interface/chat/IDeleteMessageUseCase";
import { IMessageRepository } from "../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { IChatService } from "../../../domain/interfaces/services/IChatService";
import { CHAT_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    constructor(
        @inject("IMessageRepository") private readonly _messageRepository: IMessageRepository,
        @inject("IChatService") private readonly _chatService: IChatService
    ) { }

    async execute(messageId: string, requesterId: string): Promise<void> {
        const message = await this._messageRepository.findById(messageId);
        
        if (!message) {
            throw new Error(CHAT_ERRORS.MESSAGE_NOT_FOUND);
        }

        if (message.senderId.toString() !== requesterId) {
            throw new Error("Unauthorized to delete this message");
        }

        const updatedMessage = await this._messageRepository.deleteMessage(messageId);

        this._chatService.emitToRoom(updatedMessage.roomId, updatedMessage);
    }
}
