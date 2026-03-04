import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { IGetNotificationUseCase } from "../../../application/interface/notification/IGetNotificationUseCase";
import { IMarkNotificationReadUseCase } from "../../../application/interface/notification/IMarkNotificationReadUseCase";
import { IMarkAllNotificationsReadUseCase } from "../../../application/interface/notification/IMarkAllNotificationsReadUseCase";


@injectable()
export class NotificationController {
    constructor(
        @inject("IGetNotificationUseCase") private readonly getNotificationUseCase: IGetNotificationUseCase,
        @inject("IMarkNotificationReadUseCase") private readonly markNotificationReadUseCase: IMarkNotificationReadUseCase,
        @inject("IMarkAllNotificationsReadUseCase") private readonly markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase
    ) { }

    getNotifications = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            const notifications = await this.getNotificationUseCase.execute(userId);
            return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.NOTIFICATION.GET_ALL_NOTIFICATIONS, data: notifications });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    markAsRead = async (req: AuthRequest, res: Response) => {
        try {
            const { notificationId } = req.params;
            await this.markNotificationReadUseCase.execute(notificationId as string);
            return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.NOTIFICATION.NOTIFICATION_MARK_AS_READ_SUCCESSFULLY });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    markAllAsRead = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED
                });
            }
            await this.markAllNotificationsReadUseCase.execute(userId);
            return res.status(HTTP_STATUS.OK).json({ success: true, message: MESSAGES.NOTIFICATION.NOTIFICATION_MARK_ALL_AS_READ_SUCCESSFULLY });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}