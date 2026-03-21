import { DashboardStatsDTO, IssueDistributionDTO, ModuleProgressDTO, SprintSummaryDTO, TeamActivityDTO, TopPerformerDTO } from "../../../../application/dtos/dashboard/DashboardResponseDTO";

export interface IDashboardRepository {
    getStats(projectId: string): Promise<DashboardStatsDTO>;
    getIssueDistribution(projectId: string): Promise<IssueDistributionDTO[]>;
    getModuleProgress(projectId: string, userId?: string): Promise<ModuleProgressDTO | null>;
    getRecentSprints(projectId: string): Promise<SprintSummaryDTO[]>;
    getTeamActivity(projectId: string): Promise<TeamActivityDTO[]>;
    getTopPerformer(projectId: string): Promise<TopPerformerDTO | null>;
}
