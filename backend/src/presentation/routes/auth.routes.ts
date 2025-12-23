import {Router} from 'express'
import { AuthController } from '../controllers/AuthController'

import { RegisterUserUseCase } from '../../application/useCases/auth/RegisterUserUseCase'
import { VerifyEmailUseCase } from '../../application/useCases/auth/VerifyEmailUseCase'
import { SendEmailOtpUsecase } from '../../application/useCases/auth/SendEmailOtpUseCase'
import { LoginUserUseCase } from '../../application/useCases/auth/LoginUserUseCase'

import { UserRepository } from '../../infrastructure/database/mongo/repositories/UserRepository'
import { OtpRepository } from '../../infrastructure/database/mongo/repositories/OtpRepository'

import { PasswordService } from '../../infrastructure/services/PasswordService'
import { EmailService } from '../../infrastructure/services/EmailService'
import { OtpService } from '../../infrastructure/services/OtpService'
import { JwtService } from '../../infrastructure/services/JwtService'

const router = Router();

// repo
const userRepository = new UserRepository()
const otpRepository = new OtpRepository()

//service
const passwordService =  new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()
const jwtService = new JwtService()

//otp Usecase
const sendEmailOtpUseCase = new SendEmailOtpUsecase(otpRepository,emailService,otpService)

//register usecase
const registerUserUseCase = new RegisterUserUseCase(userRepository,passwordService,sendEmailOtpUseCase)

//verify email usecase
const verifyEmailUseCase = new VerifyEmailUseCase(otpRepository,userRepository,otpService)

//Login usecase
const loginUserUseCase = new LoginUserUseCase(userRepository,passwordService,jwtService)

const authController = new AuthController(registerUserUseCase,verifyEmailUseCase,loginUserUseCase)

router.post('/register',authController.register)
router.post("/verify-email", authController.verifyEmail);
router.post("/login",authController.login)

export default router; 