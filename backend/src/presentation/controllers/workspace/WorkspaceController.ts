import { ICreateWorkspaceUseCase } from "../../../application/interface/user/ICreateWorkspaceUseCase";
import { injectable, inject } from "tsyringe";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { Request, Response } from "express";
import { ISelectPlanUseCase } from "../../../application/interface/user/ISelectPlanUseCase";
import { IGetAllPlansForUserUseCase } from "../../../application/interface/user/IGetAllPlansForUserUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { ICreateCheckoutSessionUseCase } from "../../../application/interface/user/ICreateCheckoutSessionUseCase";

@injectable()
export class WorkspaceController {

    constructor(
        @inject("ICreateWorkspaceUseCase") private _createWorkspaceUseCase: ICreateWorkspaceUseCase,
        @inject("IGetAllPlansForUserUseCase") private _getAllPlansForUserUseCase: IGetAllPlansForUserUseCase,
        @inject("ISelectPlanUseCase") private _selectPlanUseCase: ISelectPlanUseCase,
        @inject("ICreateCheckoutSessionUseCase") private _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase
    ) { }

    createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
        const ownerId = req.user?.userId;
        const workspace = await this._createWorkspaceUseCase.execute({
            name: req.body.name,
            description: req.body.description,
            ownerId: ownerId!
        });
        res.status(HTTP_STATUS.CREATED).json({
            message: MESSAGES.WORKSPACE.WORKSPACE_CREATED_SUCCESSFULLY,
            workspace
        });
    }
    getAllPlans = async (req: Request, res: Response): Promise<void> => {
        const plans = await this._getAllPlansForUserUseCase.execute()
        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.WORKSPACE.GET_ALL_PLANS_SUCCESSFULLY,
            plans
        })
    }
    selectPlan = async (req: AuthRequest, res: Response): Promise<void> => {
        const { workspaceName, planId } = req.body
        const userId = req.user?.userId
        if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
        const workspace = await this._selectPlanUseCase.execute({ workspaceName, planId, userId })
        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.WORKSPACE.PLAN_SELECTED_SUCCESSFULLY,
            data: workspace
        })
    }
    createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
        const { workspaceName, successUrl, cancelUrl, planId } = req.body;
        const userId = req.user?.userId
        const userEmail = req.user?.email
        const result = await this._createCheckoutSessionUseCase.execute({
            workspaceName,
            userId: userId!,
            userEmail: userEmail!,
            successUrl,
            cancelUrl,
            planId
        })

        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.WORKSPACE.CHECKOUT_SESSION_CREATED_SUCCESSFULLY,
            data: result
        })
    }
}