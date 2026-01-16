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

@injectable()
export class AdminController {
    constructor(
        @inject('IAdminLoginUseCase') private adminLoginUseCase: IAdminLoginUseCase,
        @inject("IAdminLogoutUseCase") private adminLogoutUseCase: IAdminLogoutUseCase,
        @inject('IBlockUserUseCase') private blockUserUseCase: IBlockUserUseCase,
        @inject('IUnblockUserUseCase') private unblockUserUseCase: IUnblockUserUseCase,
        @inject('IGetUsersUseCase') private getUsersUseCase: IGetUsersUseCase
    ) { }

    adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const response = await this.adminLoginUseCase.execute({ email, password });

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
            await this.adminLogoutUseCase.execute(token)
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
            const response = await this.getUsersUseCase.execute({ page, limit, search });
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.GET_USERS_SUCCESS, data: response });
        } catch (error) {
            next(error)
        }
    }

    blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            await this.blockUserUseCase.execute(userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.BLOCK_USER_SUCCESS })
        } catch (error) {
            next(error)
        }
    }
    unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            await this.unblockUserUseCase.execute(userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ADMIN.UNBLOCK_USER_SUCCESS })
        } catch (error) {
            next(error)
        }
    }
}