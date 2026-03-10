import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { MessageDTO } from "../../dtos/chat/requestDTOs/MessageDTO";

export interface ISendMessageUseCase {
    execute(data: MessageDTO): Promise<IMessageEntity>
}
