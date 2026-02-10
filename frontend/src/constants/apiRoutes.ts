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
  },
  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    GET_USERS: "/admin/users",
    BLOCK_USER: "/admin/block-user/:userId",
    UNBLOCK_USER: "/admin/unblock-user/:userId",
    CREATE_PLAN: "/admin/create-plan",
    GET_ALL_PLANS: "/admin/get-plans",
    UPDATE_PLAN: "/admin/update-plan/:planId"
  },
  USER: {
    VERIFY_PASSWORD: "/user/verify-password",
    PROFILE_IMAGE_UPLOAD_URL: "/user/profile/image-upload-url",
    UPDATE_PROFILE_IMAGE: "/user/profile/image",
    UPDATE_PROFILE: "/user/update-profile"
  },
  WORKSPACE: {
    CREATE_WORKSPACE : "/v1/workspace/create-workspace",
    GET_PLANS : "/v1/workspace/get-plans",
    SELECT_PLAN : "/v1/workspace/select-plan",
    CREATE_CHECKOUT_SESSION : "/v1/workspace/checkout",
    GET_USER_WORKSPACES : "/v1/workspace/user-workspaces-list",
    UPGRADE_PLAN : "/v1/workspace/upgrade-plan",
    GET_WORKSPACE_INVOICES : "/v1/workspace/:workspaceId/invoices",
    INVITE_MEMBER : "/v1/workspace/:id/invite",
    ACCEPT_INVITE : "/v1/workspace/accept-invite/:token",
    COMPLETE_PROFILE : "/v1/workspace/complete-profile",
    GET_WORKSPACE_MEMBERS : "/v1/workspace/:workspaceId/members"
  }
};