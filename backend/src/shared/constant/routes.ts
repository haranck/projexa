export const ROUTES = {
    AUTH: {
        REGISTER: "/register",
        VERIFY_EMAIL: "/verify-email",
        LOGIN: "/login",
        FORGOT_PASSWORD: "/forgot-password",
        VERIFY_RESET_OTP: "/verify-reset-otp",
        RESET_PASSWORD: "/reset-password",
        RESEND_OTP: "/resend-otp",
        LOGOUT: "/logout",
        GOOGLE_LOGIN: "/google-login",
        REFRESH_TOKEN: "/refresh-token",
    },
    USERS: {},
    ADMIN: {
        LOGIN: "/login",
        LOGOUT:"/logout",
        GET_USERS:"/users",
        BLOCK_USER:"/block-user/:userId",
        UNBLOCK_USER:"/unblock-user/:userId"
    }
};