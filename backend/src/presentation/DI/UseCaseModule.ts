import { container } from "tsyringe";
import { IRegisterUserUseCase } from "../../application/interface/auth/IRegisterUserUseCase";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { ISendEmailOtpUseCase } from "../../application/interface/auth/ISendEmailOtpUseCase";
import { SendEmailOtpUsecase } from "../../application/useCases/auth/SendEmailOtpUseCase";
import { IVerifyEmailUseCase } from "../../application/interface/auth/IVerifyEmailUseCase";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { ILoginUserUseCase } from "../../application/interface/auth/ILoginUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";
import { ILogoutUseCase } from "../../application/interface/auth/ILogoutUseCase";
import { LogoutUseCase } from "../../application/useCases/auth/LogoutUseCase";
import { IResendOtpUseCase } from "../../application/interface/auth/IResendOtpUseCase";
import { ResendOtpUseCase } from "../../application/useCases/auth/ResendOtpUseCase";
import { IForgotPasswordUseCase } from "../../application/interface/auth/IForgotPasswordUseCase";
import { ForgotPasswordUseCase } from "../../application/useCases/auth/ForgotPasswordUseCase";
import { IVerifyResetOtpUseCase } from "../../application/interface/auth/IVerifyResetOtpUseCase";
import { VerifyResetOtpUseCase } from "../../application/useCases/auth/VerifyResetOtpUseCase";
import { IResetPasswordUseCase } from "../../application/interface/auth/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase";
import { GoogleLoginUseCase } from "../../application/useCases/auth/GoogleLoginUseCase";
import { IGoogleLoginUseCase } from "../../application/interface/auth/IGoogleLoginUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../application/useCases/auth/RefreshTokenUseCase";
import { IAdminLoginUseCase } from "../../application/interface/admin/IAdminLoginUseCase";
import { AdminLoginUseCase } from "../../application/useCases/admin/AdminLoginUseCase";
import { IAdminLogoutUseCase } from "../../application/interface/admin/IAdminLogoutUseCase";
import { AdminLogoutUseCase } from "../../application/useCases/admin/AdminLogoutUseCase";
import { IBlockUserUseCase } from "../../application/interface/admin/IBlockUserUseCase";
import { IUnblockUserUseCase } from "../../application/interface/admin/IUnblockUserUseCase";
import { UnblockUserUseCase } from "../../application/useCases/admin/UnblockUserUseCase";
import { BlockUserUseCase } from "../../application/useCases/admin/BlockUserUseCase";
import { IGetUsersUseCase } from "../../application/interface/admin/IGetUsersUseCase";
import { GetUsersUseCase } from "../../application/useCases/admin/GetUsersUseCase";
import { IVerifyPasswordUseCase } from "../../application/interface/user/IVerifyPasswordUseCase";
import { VerifyPasswordUseCase } from "../../application/useCases/user/VerifyPasswordUseCase";
import { IProfileImageUploadUrlUseCase } from "../../application/interface/user/IProfileImageUploadUrlUseCase";
import { ProfileImageUploadUrlUseCase } from "../../application/useCases/user/ProfileImageUploadUrlUseCase";
import { IUpdateProfileImageUseCase } from "../../application/interface/user/IUpdateProfileImageUseCase";
import { UpdateProfileImageUseCase } from "../../application/useCases/user/UpdateProfileImageUseCase";
import { IUpdateProfileUseCase } from "../../application/interface/user/IUpdateProfileUseCase";
import { UpdateProfileUseCase } from "../../application/useCases/user/UpdateProfileUseCase";
import { ICreatePlanUseCase } from "../../application/interface/admin/ICreatePlanUseCase";
import { CreatePlanUseCase } from "../../application/useCases/admin/CreatePlanUseCase";
import { IGetPlanUseCase } from "../../application/interface/admin/IGetPlanUseCase";
import { GetPlanUseCase } from "../../application/useCases/admin/GetPlanUseCase";
import { IUpdatePlanUseCase } from "../../application/interface/admin/IUpdatePlanUseCase";
import { UpdatePlanUseCase } from "../../application/useCases/admin/UpdatePlanUseCase";
import { ICreateWorkspaceUseCase } from "../../application/interface/user/ICreateWorkspaceUseCase";
import { CreateWorkspaceUseCase } from "../../application/useCases/user/CreateWorkspaceUseCase";
import { IGetAllPlansForUserUseCase } from "../../application/interface/user/IGetAllPlansForUserUseCase";
import { GetAllPlansForUserUseCase } from "../../application/useCases/user/GetAllPlansForUserUseCase";
import { ISelectPlanUseCase } from "../../application/interface/user/ISelectPlanUseCase";
import { SelectPlanUseCase } from "../../application/useCases/user/SelectPlanUseCase";
import { ICreateCheckoutSessionUseCase } from "../../application/interface/user/ICreateCheckoutSessionUseCase";
import { CreateCheckoutSessionUseCase } from "../../application/useCases/user/CreateCheckoutSessionUseCase";
import { IWorkspaceRepository } from "../../domain/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceRepository } from "../../infrastructure/database/mongo/repositories/WorkspaceRepository";
import { ISubscriptionRepository } from "../../domain/interfaces/repositories/ISubscriptionRepository";
import { SubscriptionRepository } from "../../infrastructure/database/mongo/repositories/SubscriptionRepository";
import { IGetUserWorkspaceUseCase } from "../../application/interface/user/IGetUserWorkspaceUseCase";
import { GetUserWorkspaceUseCase } from "../../application/useCases/user/GetUserWorkspaceUseCase";
import { IStripeWebhookUseCase } from "../../application/interface/stripe/IStripeWebhookUseCase";
import { StripeWebhookUseCase } from "../../application/useCases/stripe/StripeWebhookUseCase";
import { IStripeWebhookHandler } from "../../application/interface/stripe/IStripeWebhookHandler";
import { CheckoutCompleteHandler } from "../../application/useCases/stripe/CheckoutCompleteHandler";
import { IUpgradeSubscriptionUseCase } from "../../application/interface/user/IUpgradeSubscriptionUseCase";
import { UpgradeSubscriptionUseCase } from "../../application/useCases/user/UpgradeSubscriptionUseCase";

export class UseCaseModule {
    static registerModules(): void {

        container.register<IRegisterUserUseCase>('IRegisterUserUseCase', {
            useClass: RegisterUserUseCase
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
            useClass: ForgotPasswordUseCase
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

        /*--------------------- Admin UseCases ---------------------*/

        container.register<IAdminLoginUseCase>('IAdminLoginUseCase', {
            useClass: AdminLoginUseCase
        })

        container.register<IAdminLogoutUseCase>('IAdminLogoutUseCase', {
            useClass: AdminLogoutUseCase
        })

        container.register<IBlockUserUseCase>('IBlockUserUseCase', {
            useClass: BlockUserUseCase
        })

        container.register<IUnblockUserUseCase>('IUnblockUserUseCase', {
            useClass: UnblockUserUseCase
        })

        container.register<IGetUsersUseCase>('IGetUsersUseCase', {
            useClass: GetUsersUseCase
        })

        container.register<ICreatePlanUseCase>('ICreatePlanUseCase', {
            useClass: CreatePlanUseCase
        })

        container.register<IGetPlanUseCase>("IGetPlanUseCase", {
            useClass: GetPlanUseCase
        })

        container.register<IUpdatePlanUseCase>('IUpdatePlanUseCase', {
            useClass: UpdatePlanUseCase
        })

        /*--------------------- User UseCases ---------------------*/

        container.register<IVerifyPasswordUseCase>('IVerifyPasswordUseCase', {
            useClass: VerifyPasswordUseCase
        })

        container.register<IProfileImageUploadUrlUseCase>('IProfileImageUploadUrlUseCase', {
            useClass: ProfileImageUploadUrlUseCase
        })

        container.register<IUpdateProfileImageUseCase>('IUpdateProfileImageUseCase', {
            useClass: UpdateProfileImageUseCase
        })

        container.register<IUpdateProfileUseCase>('IUpdateProfileUseCase', {
            useClass: UpdateProfileUseCase
        })

        container.register<ICreateWorkspaceUseCase>('ICreateWorkspaceUseCase', {
            useClass: CreateWorkspaceUseCase
        })

        container.register<IGetAllPlansForUserUseCase>('IGetAllPlansForUserUseCase', {
            useClass: GetAllPlansForUserUseCase
        })

        container.register<ISelectPlanUseCase>('ISelectPlanUseCase', {
            useClass: SelectPlanUseCase
        })

        container.register<ICreateCheckoutSessionUseCase>('ICreateCheckoutSessionUseCase', {
            useClass: CreateCheckoutSessionUseCase
        })

        container.register<IWorkspaceRepository>('IWorkspaceRepository', {
            useClass: WorkspaceRepository
        })

        container.register<ISubscriptionRepository>('ISubscriptionRepository', {
            useClass: SubscriptionRepository
        })

        container.register<IGetUserWorkspaceUseCase>('IGetUserWorkspaceUseCase', {
            useClass: GetUserWorkspaceUseCase
        })

        container.register<IStripeWebhookUseCase>('IStripeWebhookUseCase', {
            useClass: StripeWebhookUseCase
        })

        container.register<IStripeWebhookHandler>('IStripeWebhookHandler', {
            useClass: CheckoutCompleteHandler
        })

        container.register<IUpgradeSubscriptionUseCase>('IUpgradeSubscriptionUseCase', {
            useClass: UpgradeSubscriptionUseCase
        })
    }
}