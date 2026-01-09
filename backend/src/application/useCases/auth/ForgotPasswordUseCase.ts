import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IForgotPasswordUseCase } from "../../services/IForgotPasswordUseCase";
import { ISendEmailOtpUseCase } from "../../services/ISendEmailOtpUseCase";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('ISendEmailOtpUseCase') private sendEmailOtpUseCase: ISendEmailOtpUseCase
  ) { }
  async execute(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) return;
    await this.sendEmailOtpUseCase.execute(user);
  }
}
