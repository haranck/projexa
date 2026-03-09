import { Router } from 'express'
import { authMiddleware, notificationController } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'

const router = Router();

router.get(ROUTES.NOTIFICATION.GET_ALL_NOTIFICATIONS, authMiddleware.authenticate, notificationController.getNotifications)
router.patch(ROUTES.NOTIFICATION.MARK_AS_READ, authMiddleware.authenticate, notificationController.markAsRead)
router.patch(ROUTES.NOTIFICATION.MARK_ALL_AS_READ, authMiddleware.authenticate, notificationController.markAllAsRead)

export default router;