import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { IScheduleMeetingUseCase } from "../../../application/interface/meeting/IScheduleMeetingUseCase";
import { IGetProjectMeetingsUseCase } from "../../../application/interface/meeting/IGetProjectMeetingsUseCase";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ScheduleMeetingDTO } from "../../../application/dtos/project/requestDTOs/ScheduleMeetingDTO";
import { IJoinMeetingUseCase } from "../../../application/interface/meeting/IJoinMeetingUseCase";
import { ILeaveMeetingUseCase } from "../../../application/interface/meeting/ILeaveMeetingUseCase";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { MeetingProcessorQueue } from "../../../infrastructure/scheduler/MeetingProcessorQueue";

@injectable()
export class MeetingController {
    constructor(
        @inject("IScheduleMeetingUseCase") private scheduleMeetingUseCase: IScheduleMeetingUseCase,
        @inject("IGetProjectMeetingsUseCase") private getProjectMeetingsUseCase: IGetProjectMeetingsUseCase,
        @inject("IJoinMeetingUseCase") private joinMeetingUseCase: IJoinMeetingUseCase,
        @inject("ILeaveMeetingUseCase") private leaveMeetingUseCase: ILeaveMeetingUseCase,
        private meetingProcessorQueue: MeetingProcessorQueue
    ) { }

    async scheduleMeeting(req: AuthRequest, res: Response): Promise<void> {
        try {
            const dto: ScheduleMeetingDTO = req.body;
            if (!req.user || !req.user.userId) {
                throw new Error("User not found");
            }
            dto.hostId = req.user.userId;

            const meeting = await this.scheduleMeetingUseCase.execute(dto);
            console.log('meeting ', meeting)
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "Meeting scheduled successfully",
                data: meeting
            });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    async handleMeetingEnded(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { meetingId, recordingPath } = req.body;
            
            if (!meetingId || !recordingPath) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required fields" });
                return;
            }

            // Trigger background job
            await this.meetingProcessorQueue.addJob(meetingId, recordingPath);

            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: "Meeting processing started"
            });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}
