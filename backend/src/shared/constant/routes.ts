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
        CREATE_ROLE: "/create-role",
        UPDATE_ROLE: "/update-role/:roleId",
        DELETE_ROLE: "/delete-role/:roleId",
        GET_ROLES: "/get-roles",
    },
    STRIPE: {
        WEBHOOK: "/webhook"
    },
    PROJECTS: {
        CREATE_PROJECT: "/create-project",
        GET_ALL_PROJECTS: "/get-all-projects/:workspaceId",
        UPDATE_PROJECT: "/update-project/:projectId",
        DELETE_PROJECT: "/delete-project/:projectId",
        ADD_PROJECT_MEMBER: "/add-project-member/:projectId",
        REMOVE_PROJECT_MEMBER: "/remove-project-member/:projectId/:userId",
        UPDATE_PROJECT_MEMBER_ROLE: "/update-member-role/:projectId",
    },
    ISSUES: {
        CREATE_ISSUE: "/issues/create-issue/:projectId",
        GET_ALL_ISSUES: "/issues/get-all-issues/:projectId",
        UPDATE_ISSUE: "/issues/update-issue/:issueId",
        DELETE_ISSUE: "/issues/delete-issue/:issueId",
        ATTACHMENT_UPLOAD_URL: "/issues/attachment-upload-url",
    },
    ADMIN: {
        LOGIN: "/login",
        LOGOUT: "/logout",
        GET_USERS: "/users",
        BLOCK_USER: "/block-user/:userId",
        UNBLOCK_USER: "/unblock-user/:userId",
        CREATE_PLAN: "/create-plan",
        GET_ALL_PLAN: "/get-plans",
        UPDATE_PLAN: "/update-plan/:planId",
        GET_PAYMENTS: '/payments',
        GET_PAYMENTS_EXPORT_PDF: '/payments/export-pdf'
    }
};