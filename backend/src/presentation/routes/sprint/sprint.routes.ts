import { Router } from 'express'
import { sprintController, authMiddleware } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'

const router = Router()

router.patch(ROUTES.SPRINT.MOVE_ISSUE_TO_SPRINT, authMiddleware.authenticate, sprintController.moveIssueToSprint)
router.post(ROUTES.SPRINT.CREATE_SPRINT, authMiddleware.authenticate, sprintController.createSprint)
router.delete(ROUTES.SPRINT.DELETE_SPRINT, authMiddleware.authenticate, sprintController.deleteSprint)
router.patch(ROUTES.SPRINT.START_SPRINT, authMiddleware.authenticate, sprintController.startSprint)
router.get(ROUTES.SPRINT.GET_SPRINTS, authMiddleware.authenticate, sprintController.getSprintsByProjectId)
router.patch(ROUTES.SPRINT.COMPLETE_SPRINT, authMiddleware.authenticate, sprintController.completeSprint)

export default router
