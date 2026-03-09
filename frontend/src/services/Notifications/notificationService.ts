import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export const getNotifications = async () => {
    const response = await AxiosInstance.get(API_ROUTES.NOTIFICATION.GET_ALL_NOTIFICATIONS)
    return response.data;
}

export const markAsRead = async (notificationId: string) => {
    const response = await AxiosInstance.patch(API_ROUTES.NOTIFICATION.MARK_AS_READ.replace(':notificationId', notificationId))
    return response.data;
}

export const markAllAsRead = async () => {
    const response = await AxiosInstance.patch(API_ROUTES.NOTIFICATION.MARK_ALL_AS_READ)
    return response.data;
}