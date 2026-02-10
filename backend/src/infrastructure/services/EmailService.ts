import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import { OtpTemplate } from "../../shared/utils/OtpTemplate";
import { InviteTemplate } from "../../shared/utils/InviteTemplate";
import { env } from "../../config/envValidation";

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const html = OtpTemplate.generate(otp)

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify Your Projexa Account",
      html
    });
    console.log(`OTP for ${email}: ${otp}`);
  }

  async sendInvitationEmail(email: string, token: string): Promise<void> {
    const link = `${env.FRONTEND_URL}/workspace/accept-invite?token=${token}`;
    const html = InviteTemplate.generate(link);
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Invitation to join Projexa",
      html
    })
  }
}
