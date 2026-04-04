import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../socket/socket';
import type { RootState } from '../store/store';
import { NOTIFICATION_EVENTS } from '../constants/notification.events';
import { showNotificationToast } from '../utils/customToast';

export const useNotificationSocket = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const queryClient = useQueryClient();
    const userId = user?.id;

    useEffect(() => {
        if (isAuthenticated && userId) {
            socket.auth = { userId };

            socket.connect();

            socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            socket.on(NOTIFICATION_EVENTS.RECEIVED, (notification) => {
                if (notification && notification.message) {
                    showNotificationToast(notification);
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
                }
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            return () => {
                socket.off('connect');
                socket.off(NOTIFICATION_EVENTS.RECEIVED);
                socket.off('disconnect');
                socket.disconnect();
            };
        }
    }, [isAuthenticated, userId]);

    return socket;
};
