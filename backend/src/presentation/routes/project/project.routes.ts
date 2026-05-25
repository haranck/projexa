import { Router } from 'express'
import { projectController, authMiddleware, issueController, dashboardController, meetingController } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'
import { validateRequest } from '../../middleware/validator';
import {
    scheduleMeetingSchema,
    rescheduleMeetingSchema,
    getProjectMeetingsSchema,
    meetingIdParamSchema
} from '../../validation/meeting.validation';
import {
    createProjectSchema,
    getAllProjectsSchema,
    updateProjectSchema,
    deleteProjectSchema,
    addProjectMemberSchema,
    removeProjectMemberSchema,
    updateProjectMemberRoleSchema,
    getProjectDashboardSchema
} from '../../validation/project.validation';
import {
    createIssueSchema,
    getAttachmentUploadUrlSchema,
    updateEpicSchema,
    deleteIssueSchema,
    getAllIssuesSchema
} from '../../validation/issue.validation';

const router = Router();

router.post(
    ROUTES.PROJECTS.CREATE_PROJECT,
    authMiddleware.authenticate,
    validateRequest(createProjectSchema),
    projectController.createProject
)
router.get(
    ROUTES.PROJECTS.GET_ALL_PROJECTS,
    authMiddleware.authenticate,
    validateRequest(getAllProjectsSchema),
    projectController.getAllProjects
)
router.put(
    ROUTES.PROJECTS.UPDATE_PROJECT,
    authMiddleware.authenticate,
    validateRequest(updateProjectSchema),
    projectController.updateProject
)
router.delete(
    ROUTES.PROJECTS.DELETE_PROJECT,
    authMiddleware.authenticate,
    validateRequest(deleteProjectSchema),
    projectController.deleteProject
)
router.post(
    ROUTES.PROJECTS.ADD_PROJECT_MEMBER,
    authMiddleware.authenticate,
    validateRequest(addProjectMemberSchema),
    projectController.addProjectMember
)
router.delete(
    ROUTES.PROJECTS.REMOVE_PROJECT_MEMBER,
    authMiddleware.authenticate,
    validateRequest(removeProjectMemberSchema),
    projectController.removeProjectMember
)
router.patch(
    ROUTES.PROJECTS.UPDATE_PROJECT_MEMBER_ROLE,
    authMiddleware.authenticate,
    validateRequest(updateProjectMemberRoleSchema),
    projectController.updateProjectMemberRole
)
router.get(
    ROUTES.PROJECTS.GET_PROJECT_DASHBOARD_DATA,
    authMiddleware.authenticate,
    validateRequest(getProjectDashboardSchema),
    dashboardController.getDashboardData
)

// project issues routes
router.post(
    ROUTES.ISSUES.CREATE_ISSUE,
    authMiddleware.authenticate,
    validateRequest(createIssueSchema),
    issueController.createIssue
)
router.post(
    ROUTES.ISSUES.ATTACHMENT_UPLOAD_URL,
    authMiddleware.authenticate,
    validateRequest(getAttachmentUploadUrlSchema),
    issueController.getAttachmentUploadUrl
)
router.patch(
    ROUTES.ISSUES.UPDATE_ISSUE,
    authMiddleware.authenticate,
    validateRequest(updateEpicSchema),
    issueController.updateEpic
)
router.delete(
    ROUTES.ISSUES.DELETE_ISSUE,
    authMiddleware.authenticate,
    validateRequest(deleteIssueSchema),
    issueController.deleteIssue
)
router.get(
    ROUTES.ISSUES.GET_ALL_ISSUES,
    authMiddleware.authenticate,
    validateRequest(getAllIssuesSchema),
    issueController.getAllIssues
)

// project meetings routes
router.post(
    ROUTES.MEETINGS.SCHEDULE,
    authMiddleware.authenticate,
    validateRequest(scheduleMeetingSchema),
    meetingController.scheduleMeeting
)
router.patch(
    ROUTES.MEETINGS.RESCHEDULE,
    authMiddleware.authenticate,
    validateRequest(rescheduleMeetingSchema),
    meetingController.rescheduleMeeting
)
router.get(
    ROUTES.MEETINGS.GET_PROJECT_MEETINGS,
    authMiddleware.authenticate,
    validateRequest(getProjectMeetingsSchema),
    meetingController.getProjectMeetings
)
router.patch(
    ROUTES.MEETINGS.JOIN_MEETING,
    authMiddleware.authenticate,
    validateRequest(meetingIdParamSchema),
    meetingController.joinMeeting
)
router.patch(
    ROUTES.MEETINGS.LEAVE_MEETING,
    authMiddleware.authenticate,
    validateRequest(meetingIdParamSchema),
    meetingController.leaveMeeting
)
router.patch(
    ROUTES.MEETINGS.END_MEETING,
    authMiddleware.authenticate,
    validateRequest(meetingIdParamSchema),
    meetingController.endMeeting
)
router.get(
    ROUTES.MEETINGS.GET_MEETING_SUMMARY,
    authMiddleware.authenticate,
    validateRequest(meetingIdParamSchema),
    meetingController.getMeetingSummary
)

export default router;