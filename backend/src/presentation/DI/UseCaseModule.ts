import { container } from "tsyringe";
import { IRegisterUserService } from "../../application/services/IRegisterUserService";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { ISendEmailUserService } from "../../application/services/ISendEmailUserService";
import { SendEmailOtpUsecase } from "../../application/useCases/auth/SendEmailOtpUseCase";
import { IVerifyEmailService } from "../../application/services/IVerifyEmailService";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { ILoginUserService } from "../../application/services/ILoginUserService";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";
import { ILogoutService } from "../../application/services/ILogoutService";
import { LogoutUseCase } from "../../application/useCases/auth/LogoutUseCase";
import { IResendOtpService } from "../../application/services/IResendOtpService";
import { ResendOtpUseCase } from "../../application/useCases/auth/ResendOtpUseCase";
import { IForgotPasswordService } from "../../application/services/IForgotPasswordService";
import { ForgotPassworUseCase } from "../../application/useCases/auth/ForgotPasswordUseCase";
import { IVerifyResetOtpService } from "../../application/services/IVerifyResetOtpService";
import { VerifyResetOtpUseCase } from "../../application/useCases/auth/VerifyResetOtpUseCase";
import { IResetPasswordService } from "../../application/services/IResetPasswordService";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase";
import { GoogleLoginUseCase } from "../../application/useCases/auth/GoogleLoginUseCase";
import { IGoogleLoginService } from "../../application/services/IGoogleLoginService";
import { IRefreshTokenService } from "../../application/services/IRefreshTokenService";
import { RefreshTokenUseCase } from "../../application/useCases/auth/RefreshTokenUseCase";

export class UseCaseModule {
    static registerModules(): void {

        container.register<IRegisterUserService>('IRegisterUserService', {
            useClass: RegisterUserUseCase
        })

        container.register<SendEmailOtpUsecase>('SendEmailOtpUsecase', {
            useClass: SendEmailOtpUsecase
        })

        container.register<ISendEmailUserService>('ISendEmailUserService', {
            useClass: SendEmailOtpUsecase
        })

        container.register<IVerifyEmailService>("IVerifyEmailService", {
            useClass: VerifyEmailUseCase
        })

        container.register<ILoginUserService>("ILoginUserService", {
            useClass: LoginUserUseCase
        })

        container.register<ILogoutService>("ILogoutService", {
            useClass: LogoutUseCase
        })

        container.register<IResendOtpService>('IResendOtpService', {
            useClass: ResendOtpUseCase
        })

        container.register<IForgotPasswordService>("IForgotPasswordService", {
            useClass: ForgotPassworUseCase
        })

        container.register<IVerifyResetOtpService>("IVerifyResetOtpService", {
            useClass: VerifyResetOtpUseCase
        })

        container.register<IResetPasswordService>("IResetPasswordService", {
            useClass: ResetPasswordUseCase
        })

        container.register<IGoogleLoginService>("IGoogleLoginService", {
            useClass: GoogleLoginUseCase
        })

        container.register<IRefreshTokenService>("IRefreshTokenService", {
            useClass: RefreshTokenUseCase
        })


    }
}