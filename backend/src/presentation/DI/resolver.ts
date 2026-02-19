import { container } from 'tsyringe'

import { ContainerSetup } from './container'
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middleware/auth/authMiddleware'
import { AdminController } from '../controllers/admin/AdminController'
import { UserController } from '../controllers/user/UserController'
import { WorkspaceController } from '../controllers/workspace/WorkspaceController'
import { StripeWebhookController } from '../controllers/workspace/StripeWebhookController'
import { OnBoardingMiddleware } from '../middleware/onBoarding/onBoardingMiddleware'
import { ProjectController } from '../controllers/project/ProjectController'

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const adminController = container.resolve(AdminController);
export const userController = container.resolve(UserController)
export const workspaceController = container.resolve(WorkspaceController)
export const stripeWebhookController = container.resolve(StripeWebhookController)
export const onBoardingMiddleware = container.resolve(OnBoardingMiddleware)
export const projectController = container.resolve(ProjectController)
