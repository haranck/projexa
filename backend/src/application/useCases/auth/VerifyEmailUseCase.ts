import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IVerifyEmailUseCase } from "../../interface/auth/IVerifyEmailUseCase";
import { injectable, inject } from "tsyringe";

@injectable()
export class VerifyEmailUseCase implements IVerifyEmailUseCase {

  constructor(
    @inject('IOtpRepository') private _otpRepo: IOtpRepository,
    @inject('IUserRepository') private _userRepo: IUserRepository,
    @inject('ITempUserStore') private _tempUserStore: ITempUserStore
  ) { }

  async execute(email: string, otpCode: string): Promise<void> {
    const otp = await this._otpRepo.findValidOtp(email, otpCode)

    if (!otp) {
      throw new Error(ERROR_MESSAGES.INVALID_OTP)
    }
    const tempUser = await this._tempUserStore.get(email)
    if (!tempUser) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND)
    }

    await this._userRepo.createUser({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: email,
      password: tempUser.password,
      phone: tempUser.phone,
      avatarUrl: tempUser.avatarUrl,
      isBlocked: false,
      isEmailVerified: true,
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this._otpRepo.markAsUsed(otp._id!.toString());
    await this._tempUserStore.delete(email);
  }
}
