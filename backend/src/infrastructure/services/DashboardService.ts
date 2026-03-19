import { inject, injectable } from "tsyringe";
import { IDashboardService } from "../../domain/interfaces/services/IDashboardService";
import { IDashboardRepository } from "../../domain/interfaces/repositories/DashboardRepo/IDashboardRepository";
import { DashboardDataResponseDTO } from "../../application/dtos/dashboard/DashboardResponseDTO";

@injectable()
export class DashboardService implements IDashboardService {
    constructor(
        @inject("IDashboardRepository") private _dashboardRepo: IDashboardRepository
    ) {}

    async getProjectDashboardData(projectId: string, userId?: string): Promise<DashboardDataResponseDTO> {
        const [stats, distribution, progress, recentSprints] = await Promise.all([
            this._dashboardRepo.getStats(projectId),
            this._dashboardRepo.getIssueDistribution(projectId),
            this._dashboardRepo.getModuleProgress(projectId, userId),
            this._dashboardRepo.getRecentSprints(projectId)
        ]);

        return {
            stats,
            distribution,
            progress,
            recentSprints
        };
    }
}
