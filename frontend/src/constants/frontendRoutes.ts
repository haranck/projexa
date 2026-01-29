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
  SETTINGS: '/settings',
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

  WORKSPACE : {
    CREATE_WORKSPACE : "/workspace/create-workspace",
    GET_PLANS : "/workspace/get-plans",
    SELECT_PLAN : "/workspace/select-plan",
    CREATE_CHECKOUT_SESSION : "/workspace/checkout"
  },

  //Admin Routes

  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LOGOUT: '/admin/logout',
  ADMIN_USERS: '/admin/users',
  ADMIN_SALES_REPORT: '/admin/sales-report',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  ADMIN_PAYMENTS_DETAILS: '/admin/payments-details',
  ADMIN_WORKSPACES: '/admin/workspaces',
  ADMIN_CREATE_PLAN: "/admin/create-plan",
  ADMIN_PLANS: "/admin/get-plans"
};
