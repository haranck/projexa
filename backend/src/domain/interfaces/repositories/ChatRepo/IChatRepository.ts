import { IChatRoomEntity } from "../../../entities/Chat/IChatRoomEntity";

export interface IChatRepository {
    createRoom(room: Partial<IChatRoomEntity>): Promise<IChatRoomEntity>;
    getRoomByProjectId(projectId: string): Promise<IChatRoomEntity | null>;
    updateLastMessage(roomId: string, messageId: string): Promise<void>;
}

