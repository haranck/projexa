import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IVerifyResetOtpService } from "../../services/IVerifyResetOtpService";
import { VerifyResetOtpDTO } from "../../dtos/auth/requestDTOs/VerifyResetOtpDTO";

export class VerifyResetOtpUseCase implements IVerifyResetOtpService {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository
  ) {}
  async execute(dto: VerifyResetOtpDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error("Invalid Request");
    }
    const otp = await this.otpRepo.findValidOtp(user.id);
    if (!otp || !otp.id) throw new Error("Invalid or expired OTP");
  }
}
