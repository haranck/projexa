import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IForgotPasswordUseCase } from "../../application/interface/auth/IForgotPasswordUseCase";
import { IGoogleLoginUseCase } from "../../application/interface/auth/IGoogleLoginUseCase"
import { ILoginUserUseCase } from "../../application/interface/auth/ILoginUserUseCase";
import { ILogoutUseCase } from "../../application/interface/auth/ILogoutUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/auth/IRefreshTokenUseCase";
import { IRegisterUserUseCase } from "../../application/interface/auth/IRegisterUserUseCase";
import { IResendOtpUseCase } from "../../application/interface/auth/IResendOtpUseCase";
import { IResetPasswordUseCase } from "../../application/interface/auth/IResetPasswordUseCase";
import { IVerifyEmailUseCase } from "../../application/interface/auth/IVerifyEmailUseCase";
import { IVerifyResetOtpUseCase } from "../../application/interface/auth/IVerifyResetOtpUseCase";
import { RegisterUserDTO } from "../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { LoginUserDTO } from "../../application/dtos/auth/requestDTOs/LoginUserDTO";
import { HTTP_STATUS } from "../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../domain/constants/errorMessages";
import { MESSAGES } from "../../domain/constants/messages";
import logger from "../../config/logger";

@injectable()
export class AuthController {
  constructor(
    @inject('IRegisterUserUseCase') private readonly registerUserUseCase: IRegisterUserUseCase,
    @inject('IVerifyEmailUseCase') private readonly verifyEmailUseCase: IVerifyEmailUseCase,
    @inject('ILoginUserUseCase') private readonly loginUserUseCase: ILoginUserUseCase,
    @inject('IForgotPasswordUseCase') private readonly forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject('IResetPasswordUseCase') private readonly resetPasswordUseCase: IResetPasswordUseCase,
    @inject('IVerifyResetOtpUseCase') private readonly verifyResetOtpUseCase: IVerifyResetOtpUseCase,
    @inject('ILogoutUseCase') private readonly logoutUseCase: ILogoutUseCase,
    @inject('IResendOtpUseCase') private readonly resentOtpUseCase: IResendOtpUseCase,
    @inject('IGoogleLoginUseCase') private readonly googleLoginUseCase: IGoogleLoginUseCase,
    @inject('IRefreshTokenUseCase') private readonly refreshTokenUseCase: IRefreshTokenUseCase,

  ) { }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterUserDTO = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      };

      await this.registerUserUseCase.execute(dto);

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.OTP.OTP_SENT,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        next(err);
      }
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    console.log(email, otp)
    await this.verifyEmailUseCase.execute(email, otp);

    res.status(HTTP_STATUS.OK).json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.loginUserUseCase.execute(dto);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      logger.info("Login successful", {
        email: dto.email,
        userId: response.user.id,
      });

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.LOGIN_SUCCESS, data: response });
    } catch (err) {
      logger.error("Login failed", {
        email: req.body.email,
        error: err instanceof Error ? err.message : err,
      });
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
      return;
    }

    try {
      const response = await this.refreshTokenUseCase.execute(refreshToken);
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL, data: response });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log('Error: ', err)
        return
      }
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordUseCase.execute(req.body);
    res.json({ message: MESSAGES.OTP.OTP_SENT });
  };

  verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
    await this.verifyResetOtpUseCase.execute(req.body);
    res.json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordUseCase.execute(req.body);
    res.json({ message: MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY });
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body
    await this.resentOtpUseCase.execute(email)
    res.json({ message: MESSAGES.OTP.RESEND_OTP_SUCCESSFULL });
  }

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idToken } = req.body;
      const response = await this.googleLoginUseCase.execute(idToken);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.GOOGLE_LOGIN_SUCCESS, data: response });

    } catch (err: unknown) {
      if (err instanceof Error) {
        return next(err);
      }
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      await this.logoutUseCase.execute(token);
    }
    res.clearCookie("refreshToken");
    res.json({ message: MESSAGES.USERS.LOGOUT_SUCCESS });
  };
}
