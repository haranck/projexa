import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IResendOtpUseCase } from "../../interface/auth/IResendOtpUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        @inject('IOtpRepository') private _otpRepository: IOtpRepository,
        @inject('ITempUserStore') private _tempUserStore: ITempUserStore,
        @inject('IEmailService') private _emailService: IEmailService
    ) { }

    async execute(email: string): Promise<void> {
        const tempUser = await this._tempUserStore.get(email)
        if (!tempUser) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }
        await this._otpRepository.invalidateAll(email)

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        const ttlSeconds = 2 * 60

        await this._otpRepository.createOtp({
            userId: email,
            code: otpCode,
            expiresAt: new Date(Date.now() + ttlSeconds * 1000),
            isUsed: false,
            createdAt: new Date(),
        })

        await this._emailService.sendOtp(email, otpCode)
    }
}