import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middleware/auth/authMiddleware'

import { RegisterUserUseCase } from '../../application/useCases/auth/RegisterUserUseCase'
import { VerifyEmailUseCase } from '../../application/useCases/auth/VerifyEmailUseCase'
import { SendEmailOtpUsecase } from '../../application/useCases/auth/SendEmailOtpUseCase'
import { LoginUserUseCase } from '../../application/useCases/auth/LoginUserUseCase'
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase'
import { ResendOtpUseCase } from '../../application/useCases/auth/ResendOtpUseCase'
import { GoogleLoginUseCase } from '../../application/useCases/auth/GoogleLoginUseCase'
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase'

import { ForgotPassworUseCase } from '../../application/useCases/auth/ForgotPasswordUseCase'
import { VerifyResetOtpUseCase } from '../../application/useCases/auth/VerifyResetOtpUseCase'
import { ResetPasswordUseCase } from '../../application/useCases/auth/ResetPasswordUseCase'

import { UserRepository } from '../../infrastructure/database/mongo/repositories/UserRepository'
import { OtpRepository } from '../../infrastructure/database/mongo/repositories/OtpRepository'
import { RedisTokenBlacklistRepository } from '../../infrastructure/database/mongo/repositories/RedisTokenBlacklistRepository'

import { PasswordService } from '../../infrastructure/services/PasswordService'
import { EmailService } from '../../infrastructure/services/EmailService'
import { OtpService } from '../../infrastructure/services/OtpService'
import { JwtService } from '../../infrastructure/services/JwtService'
import { GoogleAuthService } from '../../infrastructure/services/GoogleAuthService'
import { RedisTempUserStore } from '../../infrastructure/services/RedisTempUserStore'
import { ROUTES } from '../../shared/constants/routes'

const router = Router();

// repo
const userRepository = new UserRepository()
const otpRepository = new OtpRepository()
const blacklistRepo = new RedisTokenBlacklistRepository()

//service
const passwordService = new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()
const jwtService = new JwtService()
const googleAuthService = new GoogleAuthService()
const tempUserStore = new RedisTempUserStore()

//otp Usecase
const sendEmailOtpUseCase = new SendEmailOtpUsecase(otpRepository, emailService, tempUserStore)

//register usecase
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService, sendEmailOtpUseCase)

//verify email usecase
const verifyEmailUseCase = new VerifyEmailUseCase(otpRepository, userRepository, tempUserStore)

//Login usecase
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordService, jwtService)

//Logout
const logoutUserUseCase = new LogoutUseCase(blacklistRepo, jwtService)

//resend OtpUsecase
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, tempUserStore, emailService)

//forgot usecases
const forgotPasswordUseCase = new ForgotPassworUseCase(userRepository, sendEmailOtpUseCase)
const verifyResetOtpUseCase = new VerifyResetOtpUseCase(userRepository, otpRepository)
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, otpRepository, passwordService)

//google login usecase
const googleLoginUseCase = new GoogleLoginUseCase(userRepository, jwtService, googleAuthService)

//refresh token usecase
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService, userRepository)


const authController = new AuthController(
    registerUserUseCase,
    verifyEmailUseCase,
    loginUserUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    verifyResetOtpUseCase,
    logoutUserUseCase,
    resendOtpUseCase,
    googleLoginUseCase,
    refreshTokenUseCase,
)

//midleware
const authMiddleware = new AuthMiddleware(jwtService, blacklistRepo)


router.post(ROUTES.AUTH.REGISTER, authController.register)
router.post(ROUTES.AUTH.VERIFY_EMAIL, authController.verifyEmail);
router.post(ROUTES.AUTH.LOGIN, authController.login)

router.post(ROUTES.AUTH.FORGOT_PASSWORD, authController.forgotPassword);
router.post(ROUTES.AUTH.VERIFY_RESET_OTP, authController.verifyResetOtp);
router.post(ROUTES.AUTH.RESET_PASSWORD, authController.resetPassword);
router.post(ROUTES.AUTH.RESEND_OTP, authController.resendOtp)
router.post(ROUTES.AUTH.LOGOUT, authMiddleware.authenticate, authController.logout)
router.post(ROUTES.AUTH.GOOGLE_LOGIN, authController.googleLogin)
router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refreshToken)


export default router; 
