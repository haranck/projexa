import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { IGetDashboardDataUseCase } from "../../../application/interface/dashboard/IGetDashboardDataUseCase";

@injectable()
export class DashboardController {
    constructor(
        @inject("IGetDashboardDataUseCase") private _getDashboardDataUseCase: IGetDashboardDataUseCase
    ) {}

    getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params;
            const user = req.user as { userId?: string };
            const userId = user?.userId;
            const data = await this._getDashboardDataUseCase.execute(projectId as string, userId);
            
            res.status(HTTP_STATUS.OK).json({
                message: "Dashboard data fetched successfully",
                data
            });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}
