import { Router } from 'express'
import { projectController, authMiddleware, issueController, dashboardController, meetingController } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'

const router = Router();

router.post(ROUTES.PROJECTS.CREATE_PROJECT, authMiddleware.authenticate, projectController.createProject)
router.get(ROUTES.PROJECTS.GET_ALL_PROJECTS, authMiddleware.authenticate, projectController.getAllProjects)
router.put(ROUTES.PROJECTS.UPDATE_PROJECT, authMiddleware.authenticate, projectController.updateProject)
router.delete(ROUTES.PROJECTS.DELETE_PROJECT, authMiddleware.authenticate, projectController.deleteProject)
router.post(ROUTES.PROJECTS.ADD_PROJECT_MEMBER, authMiddleware.authenticate, projectController.addProjectMember)
router.delete(ROUTES.PROJECTS.REMOVE_PROJECT_MEMBER, authMiddleware.authenticate, projectController.removeProjectMember)
router.patch(ROUTES.PROJECTS.UPDATE_PROJECT_MEMBER_ROLE, authMiddleware.authenticate, projectController.updateProjectMemberRole)
router.get(ROUTES.PROJECTS.GET_PROJECT_DASHBOARD_DATA, authMiddleware.authenticate, dashboardController.getDashboardData)

// project issues routes
router.post(ROUTES.ISSUES.CREATE_ISSUE, authMiddleware.authenticate, issueController.createIssue)
router.post(ROUTES.ISSUES.ATTACHMENT_UPLOAD_URL, authMiddleware.authenticate, issueController.getAttachmentUploadUrl)
router.patch(ROUTES.ISSUES.UPDATE_ISSUE, authMiddleware.authenticate, issueController.updateEpic)
router.delete(ROUTES.ISSUES.DELETE_ISSUE, authMiddleware.authenticate, issueController.deleteIssue)
router.get(ROUTES.ISSUES.GET_ALL_ISSUES, authMiddleware.authenticate, issueController.getAllIssues)

// project meetings routes
router.post(ROUTES.MEETINGS.SCHEDULE, authMiddleware.authenticate, meetingController.scheduleMeeting)
router.patch(ROUTES.MEETINGS.RESCHEDULE, authMiddleware.authenticate, meetingController.rescheduleMeeting)
router.get(ROUTES.MEETINGS.GET_PROJECT_MEETINGS, authMiddleware.authenticate, meetingController.getProjectMeetings)
router.patch(ROUTES.MEETINGS.JOIN_MEETING, authMiddleware.authenticate, meetingController.joinMeeting)
router.patch(ROUTES.MEETINGS.LEAVE_MEETING, authMiddleware.authenticate, meetingController.leaveMeeting)

export default router;