import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IForgotPasswordUseCase } from "../../interface/auth/IForgotPasswordUseCase";
import { ISendEmailOtpUseCase } from "../../interface/auth/ISendEmailOtpUseCase";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('ISendEmailOtpUseCase') private _sendEmailOtpUseCase: ISendEmailOtpUseCase
  ) { }
  async execute(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this._userRepo.findByEmail(dto.email);
    if (!user || !user.id) return;
    await this._sendEmailOtpUseCase.execute(user);
  }
}
