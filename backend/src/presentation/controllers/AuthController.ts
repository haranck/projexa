import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { IForgotPasswordService } from "../../application/services/IForgotPasswordService";
import { IGoogleLoginService } from "../../application/services/IGoogleLoginService"
import { ILoginUserService } from "../../application/services/ILoginUserService";
import { ILogoutService } from "../../application/services/ILogoutService";
import { IRefreshTokenService } from "../../application/services/IRefreshTokenService";
import { IRegisterUserService } from "../../application/services/IRegisterUserService";
import { IResendOtpService } from "../../application/services/IResendOtpService";
import { IResetPasswordService } from "../../application/services/IResetPasswordService";
import { IVerifyEmailService } from "../../application/services/IVerifyEmailService";
import { IVerifyResetOtpService } from "../../application/services/IVerifyResetOtpService";

import { RegisterUserDTO } from "../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { LoginUserDTO } from "../../application/dtos/auth/requestDTOs/LoginUserDTO";

import { HTTP_STATUS } from "../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../domain/constants/errorMessages";
import { MESSAGES } from "../../domain/constants/messages";
import logger from "../../config/logger";

@injectable()
export class AuthController {
  constructor(
    @inject('IRegisterUserService') private readonly registerUserService: IRegisterUserService,
    @inject('IVerifyEmailService') private readonly verifyEmailService: IVerifyEmailService,
    @inject('ILoginUserService') private readonly loginUserService: ILoginUserService,
    @inject('IForgotPasswordService') private readonly forgotPasswordService: IForgotPasswordService,
    @inject('IResetPasswordService') private readonly resetPasswordService: IResetPasswordService,
    @inject('IVerifyResetOtpService') private readonly verifyResetOtpService: IVerifyResetOtpService,
    @inject('ILogoutService') private readonly logoutService: ILogoutService,
    @inject('IResendOtpService') private readonly resentOtpService: IResendOtpService,
    @inject('IGoogleLoginService') private readonly googleLoginService: IGoogleLoginService,
    @inject('IRefreshTokenService') private readonly refreshTokenService: IRefreshTokenService,

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

      await this.registerUserService.execute(dto);

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.OTP.OTP_SENT,
      });
    } catch (err: any) {
      next(err);
    }
  };


  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    console.log(email, otp)
    await this.verifyEmailService.execute(email, otp);

    res.status(HTTP_STATUS.OK).json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL });
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.loginUserService.execute(dto);

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
      require("fs").writeFileSync("manual.log", "HELLO");

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
      const response = await this.refreshTokenService.execute(refreshToken);
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL, data: response });
    } catch (err: any) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordService.execute(req.body);
    res.json({ message: MESSAGES.OTP.OTP_SENT });
  };

  verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
    await this.verifyResetOtpService.execute(req.body);
    res.json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordService.execute(req.body);
    res.json({ message: MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY });
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body
    await this.resentOtpService.execute(email)
    res.json({ message: MESSAGES.OTP.RESEND_OTP_SUCCESSFULL });
  }

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idToken } = req.body;
      const response = await this.googleLoginService.execute(idToken);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.GOOGLE_LOGIN_SUCCESS, data: response });

    } catch (err: any) {
      return next(err);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      await this.logoutService.execute(token);
    }
    res.clearCookie("refreshToken");
    res.json({ message: MESSAGES.USERS.LOGOUT_SUCCESS });
  };
}
