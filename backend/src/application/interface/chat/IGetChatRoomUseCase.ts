import { IChatRoomEntity } from "../../../domain/entities/Chat/IChatRoomEntity";

export interface IGetChatRoomUseCase {
    execute(projectId: string): Promise<IChatRoomEntity | null>;
}