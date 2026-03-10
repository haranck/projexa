    import { injectable } from "tsyringe";
import { getIO } from "../../presentation/webSocket/server/socketServer";
import { ChatHandler } from "../../presentation/webSocket/handlers/chat.handler";
import { IChatService } from "../../domain/interfaces/services/IChatService";
import { IMessageEntity } from "../../domain/entities/Chat/IMessageEntity";

@injectable()
export class ChatService implements IChatService{

    emitToRoom(roomId: string, message: IMessageEntity): void {
        ChatHandler.emitToRoom(getIO(),roomId,message)
    }
}