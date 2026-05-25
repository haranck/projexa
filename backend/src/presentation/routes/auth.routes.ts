import { Router } from 'express'
import { authController, authMiddleware } from '../DI/resolver';
import { ROUTES } from '../../shared/constant/routes'
import { validateRequest } from '../middleware/validator';
import {
    registerSchema,
    verifyEmailSchema,
    loginSchema,
    googleLoginSchema,
    forgotPasswordSchema,
    verifyResetOtpSchema,
    resetPasswordSchema,
    resendOtpSchema
} from '../validation/auth.validation';

const router = Router();

router.post(ROUTES.AUTH.REGISTER, validateRequest(registerSchema), authController.register)
router.post(ROUTES.AUTH.VERIFY_EMAIL, validateRequest(verifyEmailSchema), authController.verifyEmail);
router.post(ROUTES.AUTH.LOGIN, validateRequest(loginSchema), authController.login)
router.post(ROUTES.AUTH.GOOGLE_LOGIN, validateRequest(googleLoginSchema), authController.googleLogin)
router.post(ROUTES.AUTH.FORGOT_PASSWORD, validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post(ROUTES.AUTH.VERIFY_RESET_OTP, validateRequest(verifyResetOtpSchema), authController.verifyResetOtp);
router.post(ROUTES.AUTH.RESET_PASSWORD, validateRequest(resetPasswordSchema), authController.resetPassword);
router.post(ROUTES.AUTH.RESEND_OTP, validateRequest(resendOtpSchema), authController.resendOtp)

router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refreshToken)
router.post(ROUTES.AUTH.LOGOUT, authMiddleware.authenticate, authController.logout)

export default router;