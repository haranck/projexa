export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_LOGIN: "/auth/google-login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    VERIFY_PASSWORD: "/auth/verify-password"
  },
  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    GET_USERS: "/admin/users",
    BLOCK_USER: "/admin/block-user/:userId",
    UNBLOCK_USER: "/admin/unblock-user/:userId"
  }
};
