import { inject, injectable } from "tsyringe";
import { IAdminLoginUseCase } from "../../../application/interface/admin/IAdminLoginUseCase";
import { NextFunction,Request,Response } from "express";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { IAdminLogoutUseCase } from "../../../application/interface/admin/IAdminLogoutUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";

@injectable()
export class AdminController {
    constructor(
        @inject('IAdminLoginUseCase') private adminLoginUseCase:IAdminLoginUseCase,
        @inject("IAdminLogoutUseCase") private adminLogoutUseCase:IAdminLogoutUseCase
    ){}

    adminLogin = async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        try {
            const {email,password} = req.body;
            const response = await this.adminLoginUseCase.execute({email,password});
            res.status(HTTP_STATUS.OK).json({message:MESSAGES.ADMIN.LOGIN_SUCCESS,data:response});
        } catch (error) {
            next(error);
        }
    }
    adminLogout  = async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if(!token) throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
            await this.adminLogoutUseCase.execute(token)
            res.clearCookie("refreshToken")
            res.json({message:MESSAGES.USERS.LOGOUT_SUCCESS})

        } catch (error) {
            next(error)
        }
    }
}