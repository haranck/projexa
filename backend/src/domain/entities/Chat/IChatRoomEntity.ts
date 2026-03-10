export interface IChatRoomEntity {
    _id?: string;
    projectId: string;
    members: string[];
    lastMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}