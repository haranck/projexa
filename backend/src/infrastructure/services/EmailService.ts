import { IEmailService } from "../../domain/interfaces/services/IEmailService";

export class EmailService implements IEmailService{
    async sendOtp(email: string, otp: string): Promise<void> {
        console.log(`OTP for ${email}: ${otp}`);
    }
}

