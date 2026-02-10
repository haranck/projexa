import { Router } from "express";
import { adminController } from "../../DI/resolver";
import { ROUTES } from '../../../shared/constant/routes'
import { authMiddleware } from "../../DI/resolver";

const router = Router()

router.post(ROUTES.ADMIN.LOGIN, adminController.adminLogin)
router.post(ROUTES.ADMIN.LOGOUT, authMiddleware.authenticate, adminController.adminLogout)
router.get(ROUTES.ADMIN.GET_USERS, authMiddleware.authenticate, adminController.getUsers)
router.post(ROUTES.ADMIN.BLOCK_USER, authMiddleware.authenticate, adminController.blockUser)
router.post(ROUTES.ADMIN.UNBLOCK_USER, authMiddleware.authenticate, adminController.unblockUser)

//plans
router.post(ROUTES.ADMIN.CREATE_PLAN, authMiddleware.authenticate, adminController.createPlan)
router.get(ROUTES.ADMIN.GET_ALL_PLAN, authMiddleware.authenticate, adminController.getAllPlans)
router.patch(ROUTES.ADMIN.UPDATE_PLAN, authMiddleware.authenticate, adminController.updatePlan)
router.get(ROUTES.ADMIN.GET_PAYMENTS, authMiddleware.authenticate, adminController.getAdminPayments)

export default router       