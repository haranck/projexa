import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/Notifications/notificationService";
import type { NotificationResponse } from "../../types/notification";

export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationId: string) => markAsRead(notificationId),
        onMutate: async (notificationId: string) => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData<NotificationResponse>(["notifications"]);

            if (previousNotifications) {
                queryClient.setQueryData<NotificationResponse>(["notifications"], {
                    ...previousNotifications,
                    data: previousNotifications.data.map(n =>
                        n._id === notificationId ? { ...n, isRead: true } : n
                    )
                });
            }
            return { previousNotifications };
        },
        onError: (_err, _id, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAllAsRead,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData<NotificationResponse>(["notifications"]);

            if (previousNotifications) {
                queryClient.setQueryData<NotificationResponse>(["notifications"], {
                    ...previousNotifications,
                    data: previousNotifications.data.map(n => ({ ...n, isRead: true }))
                });
            }
            return { previousNotifications };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};