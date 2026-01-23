import { Router } from "express";
import { workspaceController, authMiddleware } from "../../DI/resolver";
import { ROUTES } from "../../../shared/constant/routes";

const router = Router()

router.post(ROUTES.WORKSPACE.CREATE_WORKSPACE, authMiddleware.authenticate, workspaceController.createWorkspace)

export default router
