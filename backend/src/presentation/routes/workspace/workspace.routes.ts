import { Router } from "express";
import { workspaceController, authMiddleware } from "../../DI/resolver";
import { ROUTES } from "../../../shared/constant/routes";

const router = Router()

router.post(ROUTES.WORKSPACE.CREATE_WORKSPACE, authMiddleware.authenticate, workspaceController.createWorkspace)
router.get(ROUTES.WORKSPACE.GET_PLANS, authMiddleware.authenticate, workspaceController.getAllPlans)
router.post(ROUTES.WORKSPACE.SELECT_PLAN, authMiddleware.authenticate, workspaceController.selectPlan)
router.post(ROUTES.WORKSPACE.CREATE_CHECKOUT_SESSION, authMiddleware.authenticate, workspaceController.createCheckoutSession)
router.get(ROUTES.WORKSPACE.USER_WORKSPACES_LIST, authMiddleware.authenticate, workspaceController.getUserWorkspaces)
router.post(ROUTES.WORKSPACE.UPGRADE_PLAN, authMiddleware.authenticate, workspaceController.upgradeSubscription)

export default router
