import { inject, injectable } from "tsyringe";
import { IAdminLoginUseCase } from "../../../application/interface/admin/IAdminLoginUseCase";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { IAdminLogoutUseCase } from "../../../application/interface/admin/IAdminLogoutUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { IBlockUserUseCase } from "../../../application/interface/admin/IBlockUserUseCase";
import { IUnblockUserUseCase } from "../../../application/interface/admin/IUnblockUserUseCase";
import { IGetUsersUseCase } from "../../../application/interface/admin/IGetUsersUseCase";
import { ICreatePlanUseCase } from "../../../application/interface/admin/ICreatePlanUseCase";
import { IGetPlanUseCase } from "../../../application/interface/admin/IGetPlanUseCase";
import { IUpdatePlanUseCase } from "../../../application/interface/admin/IUpdatePlanUseCase";

@injectable()
export class AdminController {
    constructor(
        @inject('IAdminLoginUseCase') private _adminLoginUseCase: IAdminLoginUseCase,
        @inject("IAdminLogoutUseCase") private _adminLogoutUseCase: IAdminLogoutUseCase,
        @inject('IBlockUserUseCase') private _blockUserUseCase: IBlockUserUseCase,
        @inject('IUnblockUserUseCase') private _unblockUserUseCase: IUnblockUserUseCase,
        @inject('IGetUsersUseCase') private _getUsersUseCase: IGetUsersUseCase,
        @inject('ICreatePlanUseCase') private _createPlanUseCase: ICreatePlanUseCase,
        @inject('IGetPlanUseCase') private _getPlanUseCase: IGetPlanUseCase,
        @inject('IUpdatePlanUseCase') private _updatePlanUseCase: IUpdatePlanUseCase

    ) { }

    adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const response = await this._adminLoginUseCase.execute({ email, password });

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.LOGIN_SUCCESS, data: response });
        } catch (error) {
            next(error);
        }
    }

    adminLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
            await this._adminLogoutUseCase.execute(token)
            res.clearCookie("refreshToken")
            res.json({ message: MESSAGES.USERS.LOGOUT_SUCCESS })

        } catch (error) {
            next(error)
        }
    }
    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page)
            const limit = Number(req.query.limit)
            const search = String(req.query.search)
            const response = await this._getUsersUseCase.execute({ page, limit, search });
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.GET_USERS_SUCCESS, data: response });
        } catch (error) {
            next(error)
        }
    }

    blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            await this._blockUserUseCase.execute(userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.BLOCK_USER_SUCCESS })
        } catch (error) {
            next(error)
        }
    }
    unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            await this._unblockUserUseCase.execute(userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.UNBLOCK_USER_SUCCESS })
        } catch (error) {
            next(error)
        }
    }

    createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, price, interval, features, maxMembers, maxProjects } = req.body;
            console.log(req.body)
            const response = await this._createPlanUseCase.execute({ name, price, interval, features, maxMembers, maxProjects });
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.CREATE_PLAN_SUCCESS, data: response });
        } catch (error) {
            next(error)
        }
    }

    getAllPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const response = await this._getPlanUseCase.execute();
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.GET_PLANS_SUCCESS, data: response });
        } catch (error) {
            next(error)
        }
    }

    updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { planId } = req.params;
            const dto = req.body;
            const response = await this._updatePlanUseCase.execute(planId, dto);
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.UPDATE_PLAN_SUCCESS, data: response });
        } catch (error) {
            next(error);
        }
    }
}