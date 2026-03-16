export interface IMessageEntity {
    _id?: string;
    roomId: string;
    senderId: string;
    messageType: "text" | "image" | "video" | "document";
    content: string;
    readBy?: string[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}