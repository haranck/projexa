import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { ResetPasswordDTO } from "../../dtos/auth/requestDTOs/ResetPasswordDTO";
import { IResetPasswordUseCase } from "../../interface/auth/IResetPasswordUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('IOtpRepository') private otpRepo: IOtpRepository,
    @inject('IPasswordService') private passwordService: IPasswordService,
  ) { }

  async execute(dto: ResetPasswordDTO): Promise<void> {
    if (dto.password !== dto.confirmPassword) {
      throw new Error(ERROR_MESSAGES.PASSWORD_NOT_MATCHING);
    }

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const hashedPassword = await this.passwordService.hash(dto.password);
    await this.userRepo.updatePassword(user.id, hashedPassword);
  }
}
