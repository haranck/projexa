import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { ResetPasswordDTO } from "../../dtos/auth/requestDTOs/ResetPasswordDTO";
import { IResetPasswordService } from "../../services/IResetPasswordService";


export class ResetPasswordUseCase implements IResetPasswordService {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.id) {
      throw new Error("Invalid request");
    }

    const otp = await this.otpRepo.findValidOtp(user.id);
    if (!otp || !otp.id) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await this.passwordService.hash(dto.newPassword);

    await this.userRepo.updatePassword(user.id, hashedPassword);
    await this.otpRepo.markAsUsed(otp.id);
  }
}
