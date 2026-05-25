import { Router } from 'express'
import { sprintController, authMiddleware } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'
import { validateRequest } from '../../middleware/validator';
import {
    moveIssueToSprintSchema,
    createSprintSchema,
    deleteSprintSchema,
    startSprintSchema,
    getSprintsSchema,
    completeSprintSchema
} from '../../validation/sprint.validation';

const router = Router()

router.patch(
    ROUTES.SPRINT.MOVE_ISSUE_TO_SPRINT,
    authMiddleware.authenticate,
    validateRequest(moveIssueToSprintSchema),
    sprintController.moveIssueToSprint
)
router.post(
    ROUTES.SPRINT.CREATE_SPRINT,
    authMiddleware.authenticate,
    validateRequest(createSprintSchema),
    sprintController.createSprint
)
router.delete(
    ROUTES.SPRINT.DELETE_SPRINT,
    authMiddleware.authenticate,
    validateRequest(deleteSprintSchema),
    sprintController.deleteSprint
)
router.patch(
    ROUTES.SPRINT.START_SPRINT,
    authMiddleware.authenticate,
    validateRequest(startSprintSchema),
    sprintController.startSprint
)
router.get(
    ROUTES.SPRINT.GET_SPRINTS,
    authMiddleware.authenticate,
    validateRequest(getSprintsSchema),
    sprintController.getSprintsByProjectId
)
router.patch(
    ROUTES.SPRINT.COMPLETE_SPRINT,
    authMiddleware.authenticate,
    validateRequest(completeSprintSchema),
    sprintController.completeSprint
)

export default router
 