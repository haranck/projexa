export interface Message {
    _id: string;
    roomId: string;
    senderId: string;
    messageType: 'text' | 'image' | 'video';
    content: string;
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
    GET_HISTORY: "chat:getHistory"
}