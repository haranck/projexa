import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { OtpEntity } from "../../../domain/entities/OtpEntity";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";

export class SendEmailOtpUsecase {
  constructor(
    private otpRepo: IOtpRepository,
    private emailService: IEmailService
  ) {}

  async execute(userId: string, email: string): Promise<void> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otp: OtpEntity = {
      userId,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
      createdAt: new Date(),
    };
    await this.otpRepo.create(otp);
    await this.emailService.sendOtp(email, otpCode);
  }
}
