import { AdminDashboardStatsDTO } from "../../dtos/admin/requestDTOs/AdminDashboardStatsDTO";

export interface IGetAdminDashboardStatsUseCase {
    execute(): Promise<AdminDashboardStatsDTO>;
}
