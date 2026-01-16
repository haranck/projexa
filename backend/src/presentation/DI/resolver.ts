import { container } from 'tsyringe'

import { ContainerSetup } from './container'
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middleware/auth/authMiddleware'
import { AdminController } from '../controllers/admin/AdminController'

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const adminController = container.resolve(AdminController);


