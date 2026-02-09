import { Router } from "express";
import { workspaceController, authMiddleware } from "../../DI/resolver";
import { ROUTES } from "../../../shared/constant/routes";

const router = Router()

router.get(ROUTES.WORKSPACE.ACCEPT_INVITE, workspaceController.acceptInvite)

router.use(authMiddleware.authenticate)

router.post(ROUTES.WORKSPACE.CREATE_WORKSPACE, workspaceController.createWorkspace)
router.get(ROUTES.WORKSPACE.GET_PLANS, workspaceController.getAllPlans)
router.post(ROUTES.WORKSPACE.SELECT_PLAN, workspaceController.selectPlan)
router.post(ROUTES.WORKSPACE.CREATE_CHECKOUT_SESSION, workspaceController.createCheckoutSession)
router.get(ROUTES.WORKSPACE.USER_WORKSPACES_LIST, workspaceController.getUserWorkspaces)
router.post(ROUTES.WORKSPACE.UPGRADE_PLAN, workspaceController.upgradeSubscription)
router.get(ROUTES.WORKSPACE.GET_WORKSPACE_INVOICES, workspaceController.getWorkspaceInvoices)
router.post(ROUTES.WORKSPACE.INVITE_MEMBER, workspaceController.inviteMember)
router.post(ROUTES.WORKSPACE.COMPLETE_PROFILE, workspaceController.completeProfile)
router.get(ROUTES.WORKSPACE.GET_WORKSPACE_MEMBERS, workspaceController.getWorkspaceMembers)

export default router