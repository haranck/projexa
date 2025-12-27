import {Router} from 'express'
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middleware/auth/authMiddleware'

import { RegisterUserUseCase } from '../../application/useCases/auth/RegisterUserUseCase'
import { VerifyEmailUseCase } from '../../application/useCases/auth/VerifyEmailUseCase'
import { SendEmailOtpUsecase } from '../../application/useCases/auth/SendEmailOtpUseCase'
import { LoginUserUseCase } from '../../application/useCases/auth/LoginUserUseCase'
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase'
import { ResendOtpUseCase } from '../../application/useCases/auth/ResendOtpUseCase'

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

const router = Router();

// repo
const userRepository = new UserRepository()
const otpRepository = new OtpRepository()
const blacklistRepo = new RedisTokenBlacklistRepository()

//service
const passwordService =  new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()
const jwtService = new JwtService()
const googleAuthService = new GoogleAuthService()
const tempUserStore = new RedisTempUserStore()

//otp Usecase
const sendEmailOtpUseCase = new SendEmailOtpUsecase(otpRepository,emailService,tempUserStore)

//register usecase
const registerUserUseCase = new RegisterUserUseCase(userRepository,passwordService,sendEmailOtpUseCase)

//verify email usecase
const verifyEmailUseCase = new VerifyEmailUseCase(otpRepository,userRepository,tempUserStore)

//Login usecase
const loginUserUseCase = new LoginUserUseCase(userRepository,passwordService,jwtService)

//Logout
const logoutUserUseCase = new LogoutUseCase(blacklistRepo,jwtService)

//resend OtpUsecase
const resendOtpUseCase = new ResendOtpUseCase(otpRepository,tempUserStore,emailService)

//forgot usecases
const forgotPasswordUseCase = new ForgotPassworUseCase(userRepository,sendEmailOtpUseCase)
const verifyResetOtpUseCase = new VerifyResetOtpUseCase(userRepository,otpRepository)
const resetPasswordUseCase =new ResetPasswordUseCase(userRepository,otpRepository,passwordService)

const authController = new AuthController(
    registerUserUseCase,
    verifyEmailUseCase,
    loginUserUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    verifyResetOtpUseCase,
    logoutUserUseCase,
    resendOtpUseCase
)

//midleware
const authMiddleware = new AuthMiddleware(jwtService,blacklistRepo)


router.post('/register',authController.register)
router.post("/verify-email", authController.verifyEmail);
router.post("/login",authController.login)

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);
router.post('/resend-otp',authController.resendOtp)
router.post('/logout',authMiddleware.authenticate,authController.logout)

export default router; 
