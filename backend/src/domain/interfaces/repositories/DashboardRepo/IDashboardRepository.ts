import { DashboardStatsDTO, IssueDistributionDTO, ModuleProgressDTO, SprintSummaryDTO } from "../../../../application/dtos/dashboard/DashboardResponseDTO";

export interface IDashboardRepository {
    getStats(projectId: string): Promise<DashboardStatsDTO>;
    getIssueDistribution(projectId: string): Promise<IssueDistributionDTO[]>;
    getModuleProgress(projectId: string, userId?: string): Promise<ModuleProgressDTO | null>;
    getRecentSprints(projectId: string): Promise<SprintSummaryDTO[]>;
}
