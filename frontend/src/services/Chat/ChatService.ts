import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

export const getChatRoom = async(projectId:string) => {
    const response = await AxiosInstance.get(API_ROUTES.CHAT.GET_ROOM_BY_PROJECT.replace(":projectId", projectId))
    return response.data
}

export const getMessages = async(roomId:string) => {
    const response = await AxiosInstance.get(API_ROUTES.CHAT.GET_MESSAGES.replace(":roomId", roomId))
    return response.data
}

export const getChatUploadUrl = async (roomId: string, contentType: string) => {
    const response = await AxiosInstance.post(API_ROUTES.CHAT.GET_UPLOAD_URL.replace(":roomId", roomId), { contentType });
    return response.data;
};