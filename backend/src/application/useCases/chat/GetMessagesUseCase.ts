import { injectable, inject } from "tsyringe";
import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";
import { IMessageRepository } from "../../../domain/interfaces/repositories/ChatRepo/IMessageRepository";
import { IGetMessagesUseCase } from "../../interface/chat/IGetMessagesUseCase";

@injectable()
export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(
        @inject("IMessageRepository") private readonly _messageRepository: IMessageRepository
    ) { }

    async execute(roomId: string): Promise<IMessageEntity[]> {
        return await this._messageRepository.findByRoom(roomId);
    }
}
