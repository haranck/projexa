import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket/socket";
import { CHAT_EVENTS, type Message } from "../types/chat";

export const useChatSocket = (roomId: string | undefined, userId: string | undefined) => {
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!roomId || !userId) return;

        socket.auth = { userId };
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to chat socket server as user:', userId);
        });

        socket.emit(CHAT_EVENTS.JOIN_ROOM, roomId);

        const handleReceiveMessage = (message: Message) => {
            queryClient.setQueryData(['messages', roomId], (old: { data: Message[], message: string } | undefined) => {
                if (!old) return { data: [message], message: "" };
                if (message.isDeleted) {
                    const exists = (old.data || []).some(m => m._id === message._id);
                    if (exists) {
                        return {
                            ...old,
                            data: (old.data || []).map(m => m._id === message._id ? message : m)
                        };
                    }
                }
                return {
                    ...old,
                    data: [...(old.data || []), message]
                };
            });
        };
        socket.on(CHAT_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)

        return () => {
            socket.off(CHAT_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
            socket.disconnect();
        }
    }, [roomId, userId, queryClient])

    const sendMessage = useCallback((content: string, senderId: string) => {
        if (!roomId) {
            console.error('Cannot send message: roomId is missing');
            return;
        }
        if (!senderId) {
            console.error('Cannot send message: senderId is missing');
            return;
        }

        const messageData = {
            roomId,
            senderId,
            content,
            messageType: 'text'
        };

        console.log('Emitting message via socket:', messageData);
        socket.emit(CHAT_EVENTS.SEND_MESSAGE, messageData);
    }, [roomId])

    const deleteMessage = useCallback((messageId: string) => {
        if (!roomId) return;
        socket.emit(CHAT_EVENTS.DELETE_MESSAGE, messageId);
    }, [roomId]);

    return { sendMessage, deleteMessage }
}




