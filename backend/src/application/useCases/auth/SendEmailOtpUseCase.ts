import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { OtpEntity } from "../../../domain/entities/IOtpEntity";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IOtpService } from "../../../domain/interfaces/services/IOtpService";

export class SendEmailOtpUsecase {
  constructor(
    private otpRepo: IOtpRepository,
    private emailService: IEmailService,
    private otpService: IOtpService
  ) {}

  async execute(userId: string, email: string): Promise<void> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp =await this.otpService.hash(otpCode)

    const otp: OtpEntity = {
      userId,
      code: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
      createdAt: new Date(),
    };
    await this.otpRepo.create(otp); 
    await this.emailService.sendOtp(email, otpCode);
  }
}
