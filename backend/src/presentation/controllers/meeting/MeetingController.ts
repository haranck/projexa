import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { IScheduleMeetingUseCase } from "../../../application/interface/meeting/IScheduleMeetingUseCase";
import { IGetProjectMeetingsUseCase } from "../../../application/interface/meeting/IGetProjectMeetingsUseCase";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ScheduleMeetingDTO } from "../../../application/dtos/project/requestDTOs/ScheduleMeetingDTO";
import { IJoinMeetingUseCase } from "../../../application/interface/meeting/IJoinMeetingUseCase";
import { ILeaveMeetingUseCase } from "../../../application/interface/meeting/ILeaveMeetingUseCase";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";

@injectable()
export class MeetingController {
    constructor(
        @inject("IScheduleMeetingUseCase") private scheduleMeetingUseCase: IScheduleMeetingUseCase,
        @inject("IGetProjectMeetingsUseCase") private getProjectMeetingsUseCase: IGetProjectMeetingsUseCase,
        @inject("IJoinMeetingUseCase") private joinMeetingUseCase: IJoinMeetingUseCase,
        @inject("ILeaveMeetingUseCase") private leaveMeetingUseCase: ILeaveMeetingUseCase
    ) {}

    async scheduleMeeting(req: AuthRequest, res: Response): Promise<void> {
        try {
            const dto: ScheduleMeetingDTO = req.body;
            if (!req.user || !req.user.userId) {
                throw new Error("User not found");
            }
            dto.hostId = req.user.userId;
            
            const meeting = await this.scheduleMeetingUseCase.execute(dto);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "Meeting scheduled successfully",
                data: meeting
            });
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: err.message || "Failed to schedule meeting"
            });
        }
    }

    async getProjectMeetings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { projectId } = req.params;
            if (!req.user || !req.user.userId) {
                throw new Error("User not found");
            }
            const currentUserId = req.user.userId;
            
            const meetings = await this.getProjectMeetingsUseCase.execute(projectId as string, currentUserId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Meetings fetched successfully",
                data: meetings
            });
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: err.message || "Failed to fetch meetings"
            });
        }
    }

    async joinMeeting(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            if (!req.user || !req.user.userId) throw new Error("User not found");
            
            const meeting = await this.joinMeetingUseCase.execute(meetingId as string, req.user.userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Joined meeting successfully",
                data: meeting
            });
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: err.message || "Failed to join meeting"
            });
        }
    }

    async leaveMeeting(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            if (!req.user || !req.user.userId) throw new Error("User not found");
            
            const meeting = await this.leaveMeetingUseCase.execute(meetingId as string, req.user.userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Left meeting successfully",
                data: meeting
            });
        } catch (error: unknown) {
            const err = error as Error;
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: err.message || "Failed to leave meeting"
            });
        }
    }
}
