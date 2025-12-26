import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { VerifyEmailDTO } from "../../dtos/auth/requestDTOs/VerifyEmailDTO";
import { IOtpService } from "../../../domain/interfaces/services/IOtpService";

export class VerifyEmailUseCase {
  constructor(
    private otpRepo: IOtpRepository,
    private userRepo: IUserRepository,
    private otpService: IOtpService
  ) {}
  async execute(dto: VerifyEmailDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) throw new Error("User Not Found");

    if (!user.id) throw new Error("User id is missing");

    const otp = await this.otpRepo.findValidOtp(user.id);

    if (!otp) throw new Error("Invalid or expired OTP");

    const isMatch = await this.otpService.compare(dto.otp, otp.code);
    
    if (!isMatch) throw new Error("Invalid or expired OTP");

    if (!otp.id) throw new Error("OTP id is missing");

    await this.otpRepo.markAsUsed(otp.id);
    await this.userRepo.markEmailVerified(user.id);
  }
}
