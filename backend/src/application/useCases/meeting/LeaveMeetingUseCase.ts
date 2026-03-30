import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { ILeaveMeetingUseCase } from "../../interface/meeting/ILeaveMeetingUseCase";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class LeaveMeetingUseCase implements ILeaveMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository
    ) {}

    async execute(meetingId: string, userId: string): Promise<IMeetingEntity> {
        const meeting = await this.meetingRepo.getMeetingById(meetingId);
        if (!meeting) {
            throw new Error(MEETING_ERRORS.MEETING_NOT_FOUND);
        }

        const updatedMeeting = await this.meetingRepo.updateParticipantStatus(meetingId, userId, 'left');
        if (!updatedMeeting) {
            throw new Error("Failed to leave meeting: User not part of this meeting");
        }

        if (meeting.hostId.toString() === userId.toString()) {  
            await this.meetingRepo.updateMeetingStatus(meetingId, 'completed');
            updatedMeeting.status = 'completed';
        }

        return updatedMeeting;
    }
}
