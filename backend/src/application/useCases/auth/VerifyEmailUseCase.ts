import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { VerifyEmailDTO } from "../../dtos/auth/requestDTOs/VerifyEmailDTO";
import { IOtpService } from "../../../domain/interfaces/services/IOtpService";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IVerifyEmailService } from "../../services/IVerifyEmailService";
import { injectable ,inject } from "tsyringe";

@injectable()
export class VerifyEmailUseCase implements IVerifyEmailService{

  constructor(
    @inject('IOtpRepository') private otpRepo: IOtpRepository,
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('ITempUserStore') private tempUserStore: ITempUserStore
  ) { }

  async execute(email: string, otpCode: string): Promise<void> {
    const otp = await this.otpRepo.findValidOtp(email, otpCode)

    if (!otp) {
      throw new Error(ERROR_MESSAGES.INVALID_OTP)
    }
    const tempUser = await this.tempUserStore.get(email)
    if (!tempUser) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND)
    }

    await this.userRepo.createUser({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: email,
      password: tempUser.password,
      phone: tempUser.phone,
      avatarUrl: tempUser.avatarUrl,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })


    await this.otpRepo.markAsUsed(otp.id!);
    await this.tempUserStore.delete(email);
  }
}
