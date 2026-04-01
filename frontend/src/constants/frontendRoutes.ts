export const FRONTEND_ROUTES = {
  LANDING: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  VERIFY_EMAIL: "/verify-email",
  HOME: "/home",
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_RESET_OTP: '/verify-reset-otp',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
  PROJECTS: '/projects',
  CHAT: '/chat',
  MEETINGS: '/meetings',
  TEAMS: '/teams',
  PAYMENTS: '/payments',
  BACKLOG: '/backlog',
  BOARD: '/board',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password', 
  UPDATE_PROFILE: '/update-profile',

  //Workspce Routes

  WORKSPACE: {
    CREATE_WORKSPACE: "/workspace/create-workspace",
    GET_PLANS: "/workspace/get-plans",
    SELECT_PLAN: "/workspace/select-plan",
    CREATE_CHECKOUT_SESSION: "/workspace/checkout",
    UPGRADE_PLAN: "/workspace/upgrade-plan",
    PAYMENT_SUCCESS: "/payment-success",
    PAYMENT_CANCEL: "/payment-cancel",
    ACCEPT_INVITE: "/workspace/accept-invite"
  },

  //Admin Routes

  ADMIN_LOGIN: '/login',
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_LOGOUT: '/logout',
  ADMIN_USERS: '/users',
  ADMIN_SALES_REPORT: '/sales-report',
  ADMIN_SUBSCRIPTIONS: '/subscriptions',
  ADMIN_PAYMENTS_DETAILS: '/payments-details',
  ADMIN_WORKSPACES: '/workspaces',
  ADMIN_CREATE_PLAN: "/create-plan",
  ADMIN_PLANS: "/get-plans"
};
