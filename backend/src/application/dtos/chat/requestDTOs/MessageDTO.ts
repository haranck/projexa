export interface MessageDTO {
    roomId: string;
    senderId: string;
    messageType: "text" | "image" | "video";
    content: string;
}