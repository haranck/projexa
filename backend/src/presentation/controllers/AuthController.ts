import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { RegisterUserDTO } from "../../application/dtos/auth/RegisterUserDTO";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";

import { IForgotPasswordService } from "../../application/services/IForgotPasswordService";
import { IVerifyResetOtpService } from "../../application/services/IVerifyResetOtpService";
import { IResetPasswordService } from "../../application/services/IResetPasswordService";
import { ILogoutService } from "../../application/services/ILogoutService";
import { IGoogleLoginService } from "../../application/services/IGoogleLoginService";

import { RegisterUserDTO } from "../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { LoginUserDTO } from "../../application/dtos/auth/requestDTOs/LoginUserDTO";
import { access } from "node:fs";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly forgotPasswordService: IForgotPasswordService,
    private readonly resetPasswordService: IResetPasswordService,
    private readonly verifyResetOtpService: IVerifyResetOtpService,
    private readonly logoutService :ILogoutService,
    private readonly googleLoginService:IGoogleLoginService
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto: RegisterUserDTO = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    };

    const user = await this.registerUserUseCase.execute(dto);
    const { password, ...safeUser } = user;

    res.status(201).json({
      message: "User registered successfully",
      data: safeUser,
    });
  }

  verifyEmail = async(req:Request,res:Response):Promise<void>=>{
    await this.verifyEmailUseCase.execute(req.body)
    res.json({ message: "Email verified successfully" });
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const response = await this.loginUserUseCase.execute(dto);
      res.status(200).json({ message: "Login Successfull", data: response });
    } catch (err: any) {
      if (err.message === 'Invalid Credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
        return
      }
      return next(err);
    }
  };

  googleLogin = async (req:Request , res:Response):Promise<void> => {
    const {idToken} = req.body
    const result = await this.googleLoginService.execute(idToken)

    res.json({
      message:"Google Login Successfull",
      data:{
        accessToken:result.accessToken,
        refreshToken:result.refreshToken,
        user:{
          id:result.user.id,
          email:result.user.email,
          firstName:result.user.firstName,
          lastName:result.user.lastName,
          avatarUrl:result.user.avatarUrl,
        }
      }
    })

  }

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordService.execute(req.body);
    res.json({ message: "If the email exists, OTP has been sent" });
  };

  verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
    await this.verifyResetOtpService.execute(req.body);
    res.json({ message: "OTP verified successfully" });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordService.execute(req.body);
    res.json({ message: "Password Reset Successfull" });
  };

  logout  = async(req:Request,res:Response):Promise<void> =>{
    const token = req.headers.authorization?.split(' ')[1]
    if(token){
      await this.logoutService.execute(token)
    }
    res.json({message:"Logged Out successfully"})
  }

}
