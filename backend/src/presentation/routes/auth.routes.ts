import {Router} from 'express'
import { AuthController } from '../controllers/AuthController'

import { RegisterUserUseCase } from '../../application/useCases/auth/RegisterUserUseCase'
import { UserRepository } from '../../infrastructure/database/mongo/repositories/UserRepository'
import { PasswordService } from '../../infrastructure/services/PasswordService'

const router = Router();

const userRepository = new UserRepository()
const passwordService =  new PasswordService()

const registerUserUseCase = new RegisterUserUseCase(userRepository,passwordService)

const authController = new AuthController(registerUserUseCase)

router.post('/register',authController.register)

export default router;