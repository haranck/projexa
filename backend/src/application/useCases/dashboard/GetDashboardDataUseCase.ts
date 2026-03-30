import { inject, injectable } from "tsyringe";
import { IGetDashboardDataUseCase } from "../../interface/dashboard/IGetDashboardDataUseCase";
import { IDashboardService } from "../../../domain/interfaces/services/IDashboardService";
import { DashboardDataResponseDTO } from "../../dtos/dashboard/DashboardResponseDTO";

@injectable()
export class GetDashboardDataUseCase implements IGetDashboardDataUseCase {
    constructor(
        @inject("IDashboardService") private _dashboardService: IDashboardService
    ) {}

    async execute(projectId: string, userId?: string): Promise<DashboardDataResponseDTO> {
        return this._dashboardService.getProjectDashboardData(projectId, userId);
    }
}