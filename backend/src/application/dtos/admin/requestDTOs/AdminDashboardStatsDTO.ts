export interface AdminDashboardStatsDTO {
  totalUsers: number;
  newUsersThisMonth: number;
  totalWorkspaces: number;
  newWorkspacesThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSubscriptions: number;
  revenueByMonth: { month: string; revenue: number }[];
  userGrowthByMonth: { month: string; users: number }[];
  revenueByPlan: { plan: string; revenue: number; subscriptions: number }[];
  topWorkspaces: { name: string; members: number; plan: string }[];
}
