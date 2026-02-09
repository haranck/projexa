import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IForgotPasswordUseCase } from "../../interface/auth/IForgotPasswordUseCase";
import { ISendEmailOtpUseCase } from "../../interface/auth/ISendEmailOtpUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("ISendEmailOtpUseCase") private _sendEmailOtpUseCase: ISendEmailOtpUseCase,
  ) {}

  async execute(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this._userRepo.findByEmail(dto.email);
    if (!user||!user.id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }
    await this._sendEmailOtpUseCase.execute(user);
  }
}
