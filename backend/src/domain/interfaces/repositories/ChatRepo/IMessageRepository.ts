import { IMessageEntity } from "../../../entities/Chat/IMessageEntity";

export interface IMessageRepository {
  createMessage(message: Partial<IMessageEntity>): Promise<IMessageEntity>;
  findByRoom(roomId: string): Promise<IMessageEntity[]>;
  deleteMessage(messageId: string): Promise<IMessageEntity>;
  findById(messageId: string): Promise<IMessageEntity | null>;
  updateReadBy(messageId: string, userId: string): Promise<void>;
}