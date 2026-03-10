import { IMessageEntity } from "../../../entities/Chat/IMessageEntity";

export interface IMessageRepository {
  createMessage(message: Partial<IMessageEntity>): Promise<IMessageEntity>;
  findByRoom(roomId: string): Promise<IMessageEntity[]>;
}