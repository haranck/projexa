import { DashboardDataResponseDTO } from "../../dtos/dashboard/DashboardResponseDTO";

export interface IGetDashboardDataUseCase {
    execute(projectId: string, userId?: string): Promise<DashboardDataResponseDTO>;
}
