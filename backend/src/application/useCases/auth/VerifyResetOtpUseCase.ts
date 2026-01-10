import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IVerifyResetOtpUseCase } from "../../services/IVerifyResetOtpUseCase";
import { VerifyResetOtpDTO } from "../../dtos/auth/requestDTOs/VerifyResetOtpDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";



@injectable()
export class VerifyResetOtpUseCase implements IVerifyResetOtpUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('IOtpRepository') private otpRepo: IOtpRepository
  ) { }
  async execute(dto: VerifyResetOtpDTO): Promise<void> {

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }
    const otp = await this.otpRepo.findValidOtp(user.email, dto.otp);
    if (!otp || !otp._id) throw new Error(ERROR_MESSAGES.INVALID_OTP);
    await this.otpRepo.markAsUsed(otp._id.toString());
  }
}
