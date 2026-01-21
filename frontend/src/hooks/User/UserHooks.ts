import { useMutation } from "@tanstack/react-query";
import {
    verifyPassword,
    updateProfileImage,
    profileImageUploadUrl,
    updateProfile
} from "../../services/User/userService";

export const useVerifyPassword = () => {
    return useMutation({
        mutationFn: verifyPassword
    })
}

export const useProfileImageUploadUrl = () => {
    return useMutation({
        mutationFn: profileImageUploadUrl
    })
}

export const useUpdateProfileImage = () => {
    return useMutation({
        mutationFn: updateProfileImage
    })
}

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: updateProfile
    })
}