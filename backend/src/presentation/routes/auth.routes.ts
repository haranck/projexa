import { Router } from 'express'
import { authController,authMiddleware } from '../DI/resolver';
import { ROUTES } from '../../shared/constant/routes'

const router = Router();

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
