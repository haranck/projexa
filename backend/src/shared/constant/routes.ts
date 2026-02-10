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
    USERS: {
        VERIFY_PASSWORD: "/verify-password",
        PROFILE_IMAGE_UPLOAD_URL: "/profile/image-upload-url",
        UPDATE_PROFILE_IMAGE: "/profile/image",
        UPDATE_PROFILE: "/update-profile"
    },
    WORKSPACE: {
        CREATE_WORKSPACE: "/create-workspace",
        GET_PLANS: "/get-plans",
        SELECT_PLAN: "/select-plan",
        CREATE_CHECKOUT_SESSION: "/checkout",
        USER_WORKSPACES_LIST: "/user-workspaces-list",
        UPGRADE_PLAN: "/upgrade-plan",
        GET_WORKSPACE_INVOICES: "/:workspaceId/invoices",
        INVITE_MEMBER: "/:id/invite",
        ACCEPT_INVITE: "/accept-invite/:token",
        COMPLETE_PROFILE: "/complete-profile",
        GET_WORKSPACE_MEMBERS: "/:workspaceId/members",
        REMOVE_MEMBER: "/:workspaceId/members",
    },
    STRIPE: {
        WEBHOOK: "/webhook"
    },
    ADMIN: {
        LOGIN: "/login",
        LOGOUT: "/logout",
        GET_USERS: "/users",
        BLOCK_USER: "/block-user/:userId",
        UNBLOCK_USER: "/unblock-user/:userId",
        CREATE_PLAN: "/create-plan",
        GET_ALL_PLAN: "/get-plans",
        UPDATE_PLAN: "/update-plan/:planId"
    }
};