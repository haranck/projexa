import { useMutation } from "@tanstack/react-query";
import { registerUser, verifyOtp, resendOtp, googleLogin, loginUser } from "../../services/Auth/authService";

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


