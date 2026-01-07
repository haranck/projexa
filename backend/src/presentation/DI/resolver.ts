import {container} from 'tsyringe'

import { ContainerSetup } from './container'
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middleware/auth/authMiddleware'

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);
export const authMiddleware = container.resolve(AuthMiddleware);

