export interface IChatRoomEntity {
    _id?: string;
    projectId: string;
    members: string[];
    lastMessage?: string;
    readBy?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}