import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IOtpEntity } from "../../../domain/entities/IOtpEntity";
import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IForgotPasswordUseCase } from "../../interface/auth/IForgotPasswordUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("IOtpRepository") private _otpRepo: IOtpRepository,
    @inject("IEmailService") private _emailService: IEmailService,
  ) { }

  async execute(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this._userRepo.findByEmail(dto.email);
    if (!user || !user._id) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otp: IOtpEntity = {
      userId: user.email, // Using email as userId for OTP matching logic
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false,
      createdAt: new Date(),
    };

    await this._otpRepo.createOtp(otp);
    await this._emailService.sendOtp(user.email, otpCode);
  }
}
