import { inject, injectable } from "tsyringe";
import { IAdminLoginUseCase } from "../../../application/interface/admin/IAdminLoginUseCase";
import { NextFunction,Request,Response } from "express";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";

@injectable()
export class AdminController {
    constructor(
        @inject('IAdminLoginUseCase') private adminLoginUseCase:IAdminLoginUseCase
    ){}

    adminLogin = async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        try {
            const {email,password} = req.body;
            const response = await this.adminLoginUseCase.execute({email,password});
            res.status(HTTP_STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}