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
import { IGetUserWorkspaceUseCase } from "../../../application/interface/user/IGetUserWorkspaceUseCase";
import { IUpgradeSubscriptionUseCase } from "../../../application/interface/user/IUpgradeSubscriptionUseCase";
import { IGetWorkspaceInvoicesUseCase } from "../../../application/interface/user/IGetWorkspaceInvoicesUseCase";
import { IAcceptInviteUseCase } from "../../../application/interface/user/IAcceptInviteUseCase";
import { IInviteMemberUseCase } from "../../../application/interface/user/IInviteMemberUseCase";
import { ICompleteProfileUseCase } from "../../../application/interface/user/ICompleteProfileUseCase";
import { IGetWorkspaceMembersUseCase } from "../../../application/interface/user/IGetWorkspaceMembersUseCase";


@injectable()
export class WorkspaceController {

    constructor(
        @inject("ICreateWorkspaceUseCase") private _createWorkspaceUseCase: ICreateWorkspaceUseCase,
        @inject("IGetAllPlansForUserUseCase") private _getAllPlansForUserUseCase: IGetAllPlansForUserUseCase,
        @inject("ISelectPlanUseCase") private _selectPlanUseCase: ISelectPlanUseCase,
        @inject("ICreateCheckoutSessionUseCase") private _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
        @inject('IGetUserWorkspaceUseCase') private _getUserWorkspaceUseCase: IGetUserWorkspaceUseCase,
        @inject('IUpgradeSubscriptionUseCase') private _upgradeSubscriptionUseCase: IUpgradeSubscriptionUseCase,
        @inject('IGetWorkspaceInvoicesUseCase') private _getWorkspaceInvoicesUseCase: IGetWorkspaceInvoicesUseCase,
        @inject('IInviteMemberUseCase') private _inviteMemberUseCase: IInviteMemberUseCase,
        @inject('IAcceptInviteUseCase') private _acceptInviteUseCase: IAcceptInviteUseCase,
        @inject('ICompleteProfileUseCase') private _completeProfileUseCase: ICompleteProfileUseCase,
        @inject('IGetWorkspaceMembersUseCase') private _getWorkspaceMembersUseCase: IGetWorkspaceMembersUseCase,
    ) { }

    createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
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
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
    getAllPlans = async (req: Request, res: Response): Promise<void> => {
        try {
            const plans = await this._getAllPlansForUserUseCase.execute()
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.GET_ALL_PLANS_SUCCESSFULLY,
                plans
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
    selectPlan = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { workspaceName, planId } = req.body
            const userId = req.user?.userId
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            const workspace = await this._selectPlanUseCase.execute({ workspaceName, planId, userId })
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.PLAN_SELECTED_SUCCESSFULLY,
                data: workspace
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
    createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
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
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
    getUserWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId

            const workspaces = await this._getUserWorkspaceUseCase.execute(userId!)
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.GET_USER_WORKSPACES_SUCCESSFULLY,
                data: workspaces
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    upgradeSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const { workspaceId, newPriceId } = req.body
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            const checkoutUrl = await this._upgradeSubscriptionUseCase.execute({ workspaceId, userId, newPriceId })

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.SUBSCRIPTION_UPGRADED_SUCCESSFULLY,
                data: checkoutUrl
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getWorkspaceInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { workspaceId } = req.params
            const result = await this._getWorkspaceInvoicesUseCase.execute(workspaceId!)
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.GET_WORKSPACE_INVOICES_SUCCESSFULLY,
                data: result
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    inviteMember = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: workspaceId } = req.params;
            const { email } = req.body;
            const userId = req.user?.userId
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)

            await this._inviteMemberUseCase.execute(userId, { workspaceId, email })
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.MEMBER_INVITED_SUCCESSFULLY
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    acceptInvite = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { token } = req.params
            const result = await this._acceptInviteUseCase.execute(token!)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.MEMBER_INVITED_SUCCESSFULLY,
                data: result
            })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    completeProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const { firstName, lastName, password } = req.body
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            await this._completeProfileUseCase.execute(userId, { firstName, lastName, password })
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.PROFILE_COMPLETED_SUCCESSFULLY
            })
        } catch (error: unknown) {
            let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (error instanceof Error) {
                message = error.message;
                const errorWithStatus = error as Error & { status?: number };
                if (typeof errorWithStatus.status === 'number') {
                    status = errorWithStatus.status;
                }
            }
            res.status(status).json({ message });
        }
    }
    getWorkspaceMembers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { workspaceId } = req.params
            const result = await this._getWorkspaceMembersUseCase.execute(workspaceId!)
            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.WORKSPACE.GET_WORKSPACE_MEMBERS_SUCCESSFULLY,
                data: result
            })
        } catch (error: unknown) {
            let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (error instanceof Error) {
                message = error.message;
                const errorWithStatus = error as Error & { status?: number };
                if (typeof errorWithStatus.status === 'number') {
                    status = errorWithStatus.status;
                }
            }
            res.status(status).json({ message });
        }
    }
}
