import { DashboardDataResponseDTO } from "../../../application/dtos/dashboard/DashboardResponseDTO";

export interface IDashboardService {
    getProjectDashboardData(projectId: string, userId?: string): Promise<DashboardDataResponseDTO>;
}
