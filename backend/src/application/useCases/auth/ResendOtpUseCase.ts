import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { ITempUserStore } from "../../../domain/interfaces/services/ITempUserStore";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IResendOtpService } from "../../services/IResendOtpService";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable ,inject } from "tsyringe";

@injectable()
export class ResendOtpUseCase implements IResendOtpService {
    constructor(
        @inject('IOtpRepository') private otpRepository: IOtpRepository,
        @inject('ITempUserStore') private tempUserStore: ITempUserStore,
        @inject('IEmailService') private emailService: IEmailService
    ) { }

    async execute(email: string): Promise<void> {
        const tempUser = await this.tempUserStore.get(email)
        if (!tempUser) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }
        await this.otpRepository.invalidateAll(email)

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        const ttlSeconds = 2 * 60

        await this.otpRepository.create({
            userId: email,
            code: otpCode,
            expiresAt: new Date(Date.now() + ttlSeconds * 1000),
            isUsed: false,
            createdAt: new Date(),
        })

        await this.emailService.sendOtp(email, otpCode)
    }
}