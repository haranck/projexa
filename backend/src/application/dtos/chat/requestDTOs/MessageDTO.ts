export interface MessageDTO {
    roomId: string;
    senderId: string;
    messageType: "text" | "image" | "video" | "document";
    
    content: string;
}