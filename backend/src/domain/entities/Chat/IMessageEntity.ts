export interface IMessageEntity {
    _id?: string;
    roomId: string;
    senderId: string;
    messageType: "text" | "image" | "video";
    content: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}