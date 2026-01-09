import { container } from "tsyringe";
import { IRegisterUserUseCase } from "../../application/services/IRegisterUserUseCase";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { ISendEmailOtpUseCase } from "../../application/services/ISendEmailOtpUseCase";
import { SendEmailOtpUsecase } from "../../application/useCases/auth/SendEmailOtpUseCase";
import { IVerifyEmailUseCase } from "../../application/services/IVerifyEmailUseCase";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { ILoginUserUseCase } from "../../application/services/ILoginUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";
import { ILogoutUseCase } from "../../application/services/ILogoutUseCase";
import { LogoutUseCase } from "../../application/useCases/auth/LogoutUseCase";
import { IResendOtpUseCase } from "../../application/services/IResendOtpUseCase";
import { ResendOtpUseCase } from "../../application/useCases/auth/ResendOtpUseCase";
import { IForgotPasswordUseCase } from "../../application/services/IForgotPasswordUseCase";
import { ForgotPassworUseCase } from "../../application/useCases/auth/ForgotPasswordUseCase";
import { IVerifyResetOtpUseCase } from "../../application/services/IVerifyResetOtpUseCase";
import { VerifyResetOtpUseCase } from "../../application/useCases/auth/VerifyResetOtpUseCase";
import { IResetPasswordUseCase } from "../../application/services/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase";
import { GoogleLoginUseCase } from "../../application/useCases/auth/GoogleLoginUseCase";
import { IGoogleLoginUseCase } from "../../application/services/IGoogleLoginUseCase";
import { IRefreshTokenUseCase } from "../../application/services/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../application/useCases/auth/RefreshTokenUseCase";

export class UseCaseModule {
    static registerModules(): void {

        container.register<IRegisterUserUseCase>('IRegisterUserUseCase', {
            useClass: RegisterUserUseCase
        })

        container.register<SendEmailOtpUsecase>('SendEmailOtpUsecase', {
            useClass: SendEmailOtpUsecase
        })

        container.register<ISendEmailOtpUseCase>('ISendEmailOtpUseCase', {
            useClass: SendEmailOtpUsecase
        })

        container.register<IVerifyEmailUseCase>("IVerifyEmailUseCase", {
            useClass: VerifyEmailUseCase
        })

        container.register<ILoginUserUseCase>("ILoginUserUseCase", {
            useClass: LoginUserUseCase
        })

        container.register<ILogoutUseCase>("ILogoutUseCase", {
            useClass: LogoutUseCase
        })

        container.register<IResendOtpUseCase>('IResendOtpUseCase', {
            useClass: ResendOtpUseCase
        })

        container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
            useClass: ForgotPassworUseCase
        })

        container.register<IVerifyResetOtpUseCase>("IVerifyResetOtpUseCase", {
            useClass: VerifyResetOtpUseCase
        })

        container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
            useClass: ResetPasswordUseCase
        })

        container.register<IGoogleLoginUseCase>("IGoogleLoginUseCase", {
            useClass: GoogleLoginUseCase
        })

        container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
            useClass: RefreshTokenUseCase
        })


    }
}