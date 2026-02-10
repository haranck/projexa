import { Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { AuthRequest } from "../auth/authMiddleware";

@injectable()
export class OnBoardingMiddleware {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository
    ) { }
    onBoardingAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_ERRORS.USER_NOT_FOUND });
                return;
            }
            const user = await this._userRepository.findById(userId);
            if (!user) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: USER_ERRORS.USER_NOT_FOUND });
                return;
            }
            if (!user.onboardingCompleted) {
                res.status(HTTP_STATUS.FORBIDDEN).json({
                    message: USER_ERRORS.ONBOARDING_NOT_COMPLETED,
                    action: "COMPLETE_PROFILE"
                });
                return;
            }
            next();
        } catch (error) {
            next(error)
        }
    }
}




