import {Router} from 'express'
import { AuthController } from '../controllers/AuthController'

import { RegisterUserUseCase } from '../../application/useCases/auth/RegisterUserUseCase'
import { VerifyEmailUseCase } from '../../application/useCases/auth/VerifyEmailUseCase'
import { SendEmailOtpUsecase } from '../../application/useCases/auth/SendEmailOtpUseCase'

import { UserRepository } from '../../infrastructure/database/mongo/repositories/UserRepository'
import { OtpRepository } from '../../infrastructure/database/mongo/repositories/OtpRepository'

import { PasswordService } from '../../infrastructure/services/PasswordService'
import { EmailService } from '../../infrastructure/services/EmailService'


const router = Router();

// repo
const userRepository = new UserRepository()
const otpRepository = new OtpRepository()

//service
const passwordService =  new PasswordService()
const emailService = new EmailService()

//otp Usecase
const sendEmailOtpUseCase = new SendEmailOtpUsecase(otpRepository,emailService)

//register usecase
const registerUserUseCase = new RegisterUserUseCase(userRepository,passwordService,sendEmailOtpUseCase)

//verify email usecase
const verifyEmailUseCase = new VerifyEmailUseCase(otpRepository,userRepository)


const authController = new AuthController(registerUserUseCase,verifyEmailUseCase)

router.post('/register',authController.register)
router.post("/verify-email", authController.verifyEmail);

export default router; 