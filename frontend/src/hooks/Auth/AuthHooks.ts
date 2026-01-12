import { useMutation } from "@tanstack/react-query";
import {
    registerUser,
    verifyOtp,
    resendOtp,
    googleLogin,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyResetOtp,
    logoutUser,
    adminLogin
} from "../../services/Auth/authService";

export const useUserSignUp = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};

export const useUserVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};

export const useUserResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
    });
};

export const useBackendGoogleLogin = () => {
    return useMutation({
        mutationFn: googleLogin,
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword
    })
}

export const useVerifyResetOtp = () => {
    return useMutation({
        mutationFn: verifyResetOtp,
    });
};

export const useUserLogout = () => {
    return useMutation({
        mutationFn: logoutUser,
    });
}

export const useAdminLogin = () => {
    return useMutation({
        mutationFn:adminLogin
    })
} 
