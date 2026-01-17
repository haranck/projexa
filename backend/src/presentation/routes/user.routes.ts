import { Router } from 'express'
import { userController, authMiddleware } from '../DI/resolver';
import { ROUTES } from '../../shared/constant/routes'

const router = Router();

router.post(ROUTES.USERS.VERIFY_PASSWORD, authMiddleware.authenticate, userController.verifyPassword)
router.post(ROUTES.USERS.PROFILE_IMAGE_UPLOAD_URL, authMiddleware.authenticate, userController.getProfileImageUploadUrl)
router.put(ROUTES.USERS.UPDATE_PROFILE_IMAGE, authMiddleware.authenticate, userController.updateProfileImage)

export default router;