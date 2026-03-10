import { ISendMessageUseCase } from "../../interface/chat/ISendMessageUseCase";
import { injectable, inject } from "tsyringe";
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { IMessageRepository } from "../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { IChatRepository } from "../../../domain/interfaces/repositories/ChatRepo/IChatRepository";
import { ChatService } from "../../../infrastructure/services/ChatService";
import { MessageDTOmapper } from "../../mappers/MessageDTOmapper";
import { MessageDTO } from "../../dtos/chat/requestDTOs/MessageDTO";


@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        @inject("IMessageRepository") private readonly _messageRepository: IMessageRepository,
        @inject("IChatRepository") private readonly _chatRepository: IChatRepository,
        @inject("ChatService") private readonly _chatService: ChatService
    ) { }

    async execute(data: MessageDTO): Promise<IMessageEntity> {

        const messageData = MessageDTOmapper.toDomain(data);

        const savedMessage = await this._messageRepository.createMessage(messageData);

        if (savedMessage._id) {
            await this._chatRepository.updateLastMessage(savedMessage.roomId, savedMessage._id);
        }

        this._chatService.emitToRoom(savedMessage.roomId, savedMessage);

        return savedMessage;
    }
}