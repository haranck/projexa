import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";

import { IForgotPasswordService } from "../../application/services/IForgotPasswordService";
import { IVerifyResetOtpService } from "../../application/services/IVerifyResetOtpService";
import { IResetPasswordService } from "../../application/services/IResetPasswordService";
import { ILogoutService } from "../../application/services/ILogoutService";

import { RegisterUserDTO } from "../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { LoginUserDTO } from "../../application/dtos/auth/requestDTOs/LoginUserDTO";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly forgotPasswordService: IForgotPasswordService,
    private readonly resetPasswordService: IResetPasswordService,
    private readonly verifyResetOtpService: IVerifyResetOtpService,
    private readonly logoutService: ILogoutService
  ) {}



  register = async (req: Request, res: Response): Promise<void> => {
    const dto: RegisterUserDTO = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    };

    await this.registerUserUseCase.execute(dto);

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete registration",
    });
  };


  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    console.log(email,otp)
    await this.verifyEmailUseCase.execute(email, otp);

    res.json({ message: "Email verified successfully. Account created." });
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.loginUserUseCase.execute(dto);
      res.status(200).json({ message: "Login Successfull", data: response });
    } catch (err: any) {
      if (err.message === "Invalid Credentials") {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      return next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordService.execute(req.body);
    res.json({ message: "If the email exists, OTP has been sent" });
  };

  verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
    await this.verifyResetOtpService.execute(req.body);
    res.json({ message: "OTP verified successfully" });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {

    console.log('dfs',req.body);
    
    await this.resetPasswordService.execute(req.body);
    res.json({ message: "Password Reset Successfull" });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      await this.logoutService.execute(token);
    }
    res.json({ message: "Logged Out successfully" });
  };
}
