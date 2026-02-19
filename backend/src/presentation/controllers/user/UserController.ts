import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { IVerifyPasswordUseCase } from "../../../application/interface/user/IVerifyPasswordUseCase";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { IProfileImageUploadUrlUseCase } from "../../../application/interface/user/IProfileImageUploadUrlUseCase";
import { IUpdateProfileImageUseCase } from "../../../application/interface/user/IUpdateProfileImageUseCase";
import { IUpdateProfileUseCase } from "../../../application/interface/user/IUpdateProfileUseCase";

@injectable()
export class UserController {
    constructor(
        @inject("IVerifyPasswordUseCase") private readonly _verifyPasswordUseCase: IVerifyPasswordUseCase,
        @inject("IProfileImageUploadUrlUseCase") private readonly _profileImageUploadUrlUseCase: IProfileImageUploadUrlUseCase,
        @inject("IUpdateProfileImageUseCase") private readonly _updateProfileImageUseCase: IUpdateProfileImageUseCase,
        @inject("IUpdateProfileUseCase") private readonly _updateProfileUseCase: IUpdateProfileUseCase
    ) { }

    verifyPassword = async (req: AuthRequest, res: Response): Promise<void> => {
        const { password } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        }

        await this._verifyPasswordUseCase.execute({ userId, password });
        res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.PASSWORD_VERIFIED_SUCCESSFULLY });
    }
    getProfileImageUploadUrl = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId;
        const { contentType } = req.body;
        if (!userId) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
            return;
        }
        const result = await this._profileImageUploadUrlUseCase.execute({ userId, contentType });
        res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.PROFILE_IMAGE_UPLOAD_URL_GENERATED_SUCCESSFULLY, data: result });
    }
    updateProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.userId
        const { profileImage } = req.body
        if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
        if (!profileImage) throw new Error(ERROR_MESSAGES.BAD_REQUEST)
        const result = await this._updateProfileImageUseCase.execute({ userId, profileImage })
        res.status(HTTP_STATUS.OK).json({ message: result.message, data: result });
    }
    updateProfile = async (req:AuthRequest,res:Response):Promise<void> => {
        const {firstName,lastName,phoneNumber} =  req.body
        const userId = req.user?.userId
        if(!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
        if(!firstName||!lastName||!phoneNumber) throw new Error(ERROR_MESSAGES.BAD_REQUEST)
        const result  = await this._updateProfileUseCase.execute({userId,firstName,lastName,phoneNumber})
        res.status(HTTP_STATUS.OK).json({message:result.message,data:result})
    }
}