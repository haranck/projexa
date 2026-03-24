import { useEffect, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket/socket";
import { CHAT_EVENTS, type Message } from "../types/chat";

export const useChatSocket = (roomId: string | undefined, userId: string | undefined, allRoomIds: string[] = [], projectId?: string) => {
    const queryClient = useQueryClient();
    const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(() => userId ? new Set([userId]) : new Set());

    useEffect(() => {
        if (!userId) return;

        socket.auth = { userId };
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to chat socket server as user:', userId);

            if (roomId) {
                socket.emit(CHAT_EVENTS.JOIN_ROOM, roomId);
            }

            allRoomIds.forEach(id => {
                if (id !== roomId) {
                    socket.emit(CHAT_EVENTS.JOIN_ROOM, id);
                }
            });

            if (projectId || roomId) {
                socket.emit(CHAT_EVENTS.GET_ONLINE_USERS, projectId || roomId);
            }
        });

        if (roomId) {
            socket.emit(CHAT_EVENTS.JOIN_ROOM, roomId);
        }

        if (projectId || roomId) {
            socket.emit(CHAT_EVENTS.GET_ONLINE_USERS, projectId || roomId);
        }

        allRoomIds.forEach(id => {
            if (id && id !== roomId) {
                socket.emit(CHAT_EVENTS.JOIN_ROOM, id);
            }
        });

        const handleReceiveMessage = (message: Message) => {
            queryClient.setQueryData(['messages', roomId], (old: { data: Message[], message: string } | undefined) => {
                if (!old) return { data: [message], message: "" };

                if (message.isDeleted || message.readBy) {
                    const exists = (old.data || []).some(m => m._id === message._id);
                    if (exists) {
                        return {
                            ...old,
                            data: (old.data || []).map(m => m._id === message._id ? message : m)
                        };
                    }
                }

                const alreadyExists = (old.data || []).some(m => m._id === message._id);
                if (alreadyExists) return old;

                return {
                    ...old,
                    data: [...(old.data || []), message]
                };
            });
        };

        const handleReadUpdate = (message: Message) => {
            queryClient.setQueryData(['messages', roomId], (old: { data: Message[], message: string } | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    data: (old.data || []).map(m => m._id === message._id ? message : m)
                };
            });
        };

        const handleTyping = ({ roomId: typingRoomId, userId: typingUserId, projectId: typingProjectId }: { roomId: string, userId: string, projectId?: string }) => {
            if (typingUserId === userId) return;
            const key = typingProjectId || typingRoomId;
            setTypingUsers(prev => ({
                ...prev,
                [key]: [...(new Set([...(prev[key] || []), typingUserId]))]
            }));
        };

        const handleStopTyping = ({ roomId: typingRoomId, userId: typingUserId, projectId: typingProjectId }: { roomId: string, userId: string, projectId?: string }) => {
            const key = typingProjectId || typingRoomId;
            setTypingUsers(prev => ({
                ...prev,
                [key]: (prev[key] || []).filter(id => id !== typingUserId)
            }));
        };

        const handleUserOnline = ({ userId: onlineId }: { userId: string }) => {
            setOnlineUsers(prev => new Set([...prev, onlineId]));
        };

        const handleUserOffline = ({ userId: offlineId }: { userId: string }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(offlineId);
                return next;
            });
        };

        const handleOnlineUsersList = (users: string[]) => {
            const set = new Set(users);
            if (userId) set.add(userId);
            setOnlineUsers(set);
        };

        socket.on(CHAT_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
        socket.on(CHAT_EVENTS.READ_UPDATE, handleReadUpdate)
        socket.on(CHAT_EVENTS.TYPING, handleTyping)
        socket.on(CHAT_EVENTS.STOP_TYPING, handleStopTyping)
        socket.on(CHAT_EVENTS.USER_ONLINE, handleUserOnline)
        socket.on(CHAT_EVENTS.USER_OFFLINE, handleUserOffline)
        socket.on(CHAT_EVENTS.ONLINE_USERS_LIST, handleOnlineUsersList)

        return () => {
            socket.off(CHAT_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
            socket.off(CHAT_EVENTS.READ_UPDATE, handleReadUpdate)
            socket.off(CHAT_EVENTS.TYPING, handleTyping)
            socket.off(CHAT_EVENTS.STOP_TYPING, handleStopTyping)
            socket.off(CHAT_EVENTS.USER_ONLINE, handleUserOnline)
            socket.off(CHAT_EVENTS.USER_OFFLINE, handleUserOffline)
            socket.off(CHAT_EVENTS.ONLINE_USERS_LIST, handleOnlineUsersList)
            socket.disconnect();
        }
    }, [roomId, userId, queryClient, JSON.stringify(allRoomIds)])

    const sendMessage = useCallback((content: string, senderId: string, messageType: Message['messageType'] = 'text') => {
        if (!roomId || !senderId) return;

        const messageData = {
            roomId,
            senderId,
            content,
            messageType
        };

        console.log('Sending message:', messageData);
        socket.emit(CHAT_EVENTS.SEND_MESSAGE, messageData);
    }, [roomId])

    const deleteMessage = useCallback((messageId: string) => {
        if (!roomId) return;
        socket.emit(CHAT_EVENTS.DELETE_MESSAGE, messageId);
    }, [roomId]);

    const markAsRead = useCallback((messageId: string) => {
        if (!roomId) return;
        socket.emit(CHAT_EVENTS.READ, messageId);
    }, [roomId]);

    const startTyping = useCallback((projectId?: string) => {
        if (!roomId) return;
        socket.emit(CHAT_EVENTS.TYPING, { roomId, projectId });
    }, [roomId]);

    const stopTyping = useCallback((projectId?: string) => {
        if (!roomId) return;
        socket.emit(CHAT_EVENTS.STOP_TYPING, { roomId, projectId });
    }, [roomId]);

    return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping, typingUsers, onlineUsers }
}