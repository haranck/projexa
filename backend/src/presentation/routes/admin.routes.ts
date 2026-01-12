import { Router } from "express";
import { adminController } from "../DI/resolver";
import { ROUTES } from "../../shared/constant/routes";
import { authMiddleware } from "../DI/resolver";

const router = Router()

router.post(ROUTES.ADMIN.LOGIN,adminController.adminLogin) 
router.post(ROUTES.ADMIN.LOGOUT,authMiddleware.authenticate,adminController.adminLogout)

export default router 