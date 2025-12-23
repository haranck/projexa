import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { RegisterUserDTO } from "../../application/dtos/auth/RegisterUserDTO";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";
import { LoginUserDTO } from "../../application/dtos/auth/LoginUserDTO";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase :VerifyEmailUseCase,
    private readonly loginUserUseCase : LoginUserUseCase
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

  login  = async (req:Request,res:Response):Promise<void> =>{
    const dto:LoginUserDTO = {
      email:req.body.email,
      password:req.body.password,
    }
    const response  = await this.loginUserUseCase.execute(dto)
    res.status(200).json({message:"Login Successfull",data:response})
  }
}
