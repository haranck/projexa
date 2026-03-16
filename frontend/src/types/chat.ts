export interface Message {
    _id: string;
    roomId: string;
    senderId: string;
    messageType: 'text' | 'image' | 'video' | 'document';
    content: string;
    readBy?: string[];
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChatRoom {
    _id: string;
    projectId: string;
    members: string[];
    lastMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export const CHAT_EVENTS = {
    JOIN_ROOM: "chat:join",
    SEND_MESSAGE: "chat:send",
    RECEIVE_MESSAGE: "chat:receive",
    TYPING: "chat:typing",
    STOP_TYPING: "chat:stopTyping",
    GET_HISTORY: "chat:getHistory",
    DELETE_MESSAGE: "chat:delete",
    READ: "chat:read",
    READ_UPDATE: "chat:readUpdate"
}