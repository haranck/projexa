import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { RegisterUserDTO } from "../../application/dtos/auth/RegisterUserDTO";

export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

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
    
  };
}
