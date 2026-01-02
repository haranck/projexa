import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IVerifyResetOtpService } from "../../services/IVerifyResetOtpService";
import { VerifyResetOtpDTO } from "../../dtos/auth/requestDTOs/VerifyResetOtpDTO";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

export class VerifyResetOtpUseCase implements IVerifyResetOtpService {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository
  ) { }
  async execute(dto: VerifyResetOtpDTO): Promise<void> {

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }
    const otp = await this.otpRepo.findValidOtp(user.email, dto.otp);
    if (!otp || !otp.id) throw new Error(ERROR_MESSAGES.INVALID_OTP);
    await this.otpRepo.markAsUsed(otp.id);
  }
}
