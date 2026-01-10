import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IOtpEntity } from "../../../domain/entities/IOtpEntity";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { ITempUserStore, ITempUserData } from "../../../domain/interfaces/services/ITempUserStore";
import { injectable, inject } from "tsyringe";
import { ISendEmailOtpUseCase } from "../../services/ISendEmailOtpUseCase"

@injectable()
export class SendEmailOtpUsecase implements ISendEmailOtpUseCase {
  constructor(
    @inject('IOtpRepository') private otpRepo: IOtpRepository,
    @inject('IEmailService') private emailService: IEmailService,
    @inject('ITempUserStore') private tempUserStore: ITempUserStore,
  ) { }

  async execute(userData: ITempUserData): Promise<void> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const ttlSeconds = 10 * 60


    await this.tempUserStore.save(userData.email, userData, ttlSeconds)

    const otp: IOtpEntity = {
      userId: userData.email,
      code: otpCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      isUsed: false,
      createdAt: new Date(),
    };
    await this.otpRepo.createOtp(otp);
    await this.emailService.sendOtp(userData.email, otpCode);
  }
}
