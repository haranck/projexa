import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { IMeetingSummaryRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingSummaryRepository";
import { IMeetingSummaryQueueService } from "../../../domain/interfaces/services/IMeetingSummaryQueueService";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { IEndMeetingUseCase } from "../../interface/meeting/IEndMeetingUseCase";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { IMeetingSummaryEntity } from "../../../domain/entities/Meeting/IMeetingSummaryEntity";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";

@injectable()
export class EndMeetingUseCase implements IEndMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository,
        @inject("IMeetingSummaryRepository") private summaryRepo: IMeetingSummaryRepository,
        @inject("IMeetingSummaryQueueService") private queueService: IMeetingSummaryQueueService,
        @inject("ISendNotificationUseCase") private sendNotification: ISendNotificationUseCase
    ) {}

    async execute(
        meetingId: string,
        hostId: string
    ): Promise<{ meeting: IMeetingEntity; summary: IMeetingSummaryEntity }> {
        const meeting = await this.meetingRepo.getMeetingById(meetingId);
        if (!meeting) {
            const err = new Error(MEETING_ERRORS.MEETING_NOT_FOUND) as Error & { status: number };
            err.status = HTTP_STATUS.NOT_FOUND;
            throw err;
        }

        if (meeting.hostId !== hostId) {
            const err = new Error(MEETING_ERRORS.ONLY_HOST_CAN_END_MEETING) as Error & { status: number };
            err.status = HTTP_STATUS.FORBIDDEN;
            throw err;
        }

        if (meeting.status === "completed") {
            const err = new Error(MEETING_ERRORS.MEETING_ALREADY_COMPLETED) as Error & { status: number };
            err.status = HTTP_STATUS.CONFLICT;
            throw err;
        }

        // Mark the meeting as completed
        const updatedMeeting = await this.meetingRepo.updateMeetingStatus(meetingId, "completed");
        if (!updatedMeeting) {
            throw new Error(MEETING_ERRORS.FAILED_TO_UPDATE_MEETING);
        }

        // Create a pending summary record immediately
        const summary = await this.summaryRepo.createSummary(meetingId);

        // Enqueue the background AI job
        await this.queueService.addSummaryJob({
            meetingId,
            meetingTitle: meeting.title,
            projectId: meeting.projectId,
        });

        // Notify all participants that the meeting has ended
        for (const participant of meeting.participants) {
            await this.sendNotification.execute({
                recipientId: participant.userId,
                eventType: NotificationEventType.MEETING_COMPLETED,
                message: `Meeting "${meeting.title}" has ended. AI summary is being generated.`,
                resourceId: meetingId,
                resourceType: "meeting",
            });
        }

        return { meeting: updatedMeeting, summary };
    }
}
