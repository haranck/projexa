export interface TeamActivity {
    userId: string;
    userName: string;
    role: string;
    profilePicture?: string;
    totalTime: number;
    hoursLogged: number;
}

export interface TopPerformer {
    userId: string;
    userName: string;
    role: string;
    profilePicture?: string;
    hoursLogged: number;
    issuesCompleted: number;
}

export interface DashboardStats {
    totalIssues: number;
    completedIssues: number;
    activeSprintsCount: number;
    memberCount: number;
    completionRate: number;
}

export interface IssueDistribution {
    type: string;
    count: number;
}

export interface ModuleProgress {
    sprintName: string;
    completedPoints: number;
    totalPoints: number;
    percentage: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
    storyCount: number;
    taskCount: number;
    bugCount: number;
}

export interface SprintSummary {
    id: string;
    name: string;
    status: string;
    progress: number;
}

export interface DashboardData {
    stats: DashboardStats;
    distribution: IssueDistribution[];
    progress: ModuleProgress | null;
    recentSprints: SprintSummary[];
    teamActivity: TeamActivity[];
    topPerformer: TopPerformer | null;
}

export interface AdminDashboardStats {
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
