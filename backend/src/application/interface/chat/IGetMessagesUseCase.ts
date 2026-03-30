import { IMessageEntity } from "../../../domain/entities/Chat/IMessageEntity";

export interface IGetMessagesUseCase {
    execute(roomId: string): Promise<IMessageEntity[]>
}
