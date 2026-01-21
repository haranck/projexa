import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

interface verifyPasswordPayload {
    password: string,
}

interface updateProfileImagePayload {
    userId: string,
    profileImage: string
}

interface updateProfilePayload {
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export const verifyPassword = async (data: verifyPasswordPayload) => {
    const response = await AxiosInstance.post(API_ROUTES.USER.VERIFY_PASSWORD, data);
    return response.data;
}

export const profileImageUploadUrl = async (contentType: string) => {
    const response = await AxiosInstance.post(API_ROUTES.USER.PROFILE_IMAGE_UPLOAD_URL, { contentType });
    return response.data;
}

export const updateProfileImage = async (data: updateProfileImagePayload) => {
    const response = await AxiosInstance.put(API_ROUTES.USER.UPDATE_PROFILE_IMAGE, data)
    return response.data;
}

export const updateProfile = async(data:updateProfilePayload) => {
    const repsonse  = await AxiosInstance.put(API_ROUTES.USER.UPDATE_PROFILE,data)
    return repsonse.data;
}