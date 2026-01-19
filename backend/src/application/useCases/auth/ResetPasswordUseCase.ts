import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { ResetPasswordDTO } from "../../dtos/auth/requestDTOs/ResetPasswordDTO";
import { IResetPasswordUseCase } from "../../interface/auth/IResetPasswordUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('IPasswordService') private _passwordService: IPasswordService,
  ) { }

  async execute(dto: ResetPasswordDTO): Promise<void> {
    if (dto.password !== dto.confirmPassword) {
      throw new Error(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);
    }

    const user = await this._userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const hashedPassword = await this._passwordService.hash(dto.password);
    await this._userRepo.updatePassword(user.id, hashedPassword);
  }
}
