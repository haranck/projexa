import { DashboardStatsDTO, IssueDistributionDTO, ModuleProgressDTO, OverdueTaskDTO, SprintSummaryDTO, TeamActivityDTO, TodayMeetingDTO, TopPerformerDTO } from "../../../../application/dtos/dashboard/DashboardResponseDTO";

export interface IDashboardRepository {
    getStats(projectId: string): Promise<DashboardStatsDTO>;
    getIssueDistribution(projectId: string): Promise<IssueDistributionDTO[]>;
    getModuleProgress(projectId: string, userId?: string): Promise<ModuleProgressDTO | null>;
    getRecentSprints(projectId: string): Promise<SprintSummaryDTO[]>;
    getTeamActivity(projectId: string): Promise<TeamActivityDTO[]>;
    getTopPerformer(projectId: string): Promise<TopPerformerDTO | null>;
    getOverdueTasks(projectId: string, userId?: string): Promise<OverdueTaskDTO[]>;
    getTodayMeetings(projectId: string, userId?: string): Promise<TodayMeetingDTO[]>;
}
