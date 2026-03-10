import { Router } from 'express'
import { authMiddleware, chatController } from '../../DI/resolver';
import { ROUTES } from '../../../shared/constant/routes'

const router = Router();

router.get(ROUTES.CHAT.GET_ROOM_BY_PROJECT, authMiddleware.authenticate, chatController.getChatRoom)
router.get(ROUTES.CHAT.GET_MESSAGES, authMiddleware.authenticate, chatController.getMessages)

export default router;