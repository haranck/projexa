import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { OtpEntity } from "../../../domain/entities/IOtpEntity";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IOtpService } from "../../../domain/interfaces/services/IOtpService";
import { ITempUserStore ,TempUserData } from "../../../domain/interfaces/services/ITempUserStore";


export class SendEmailOtpUsecase {
  constructor(
    private otpRepo: IOtpRepository,
    private emailService: IEmailService,
    private tempUserStore:ITempUserStore,

  ) {}

  async execute(userData:TempUserData): Promise<void> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const ttlSeconds = 10 * 60


    await this.tempUserStore.save(userData.email,userData,ttlSeconds)

    const otp: OtpEntity = {
      userId:userData.email,
      code: otpCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      isUsed: false,
      createdAt: new Date(),
    };
    await this.otpRepo.create(otp); 
    await this.emailService.sendOtp(userData.email, otpCode);
  }
}
