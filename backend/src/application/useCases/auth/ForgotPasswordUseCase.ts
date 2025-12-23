import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { SendEmailOtpUsecase } from "./SendEmailOtpUseCase";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IForgotPasswordService } from "../../services/IForgotPasswordService";

export class ForgotPassworUseCase implements IForgotPasswordService {
  constructor(
    private userRepo: IUserRepository,
    private sendEmailOtpUseCase: SendEmailOtpUsecase
  ) {}
  async execute(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) return;
    await this.sendEmailOtpUseCase.execute(user.id, user.email);
  }
}
