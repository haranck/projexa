import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../../domain/interfaces/repositories/MeetingRepo/IMeetingRepository";
import { IJoinMeetingUseCase } from "../../interface/meeting/IJoinMeetingUseCase";
import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class JoinMeetingUseCase implements IJoinMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepo: IMeetingRepository
    ) {}

    async execute(meetingId: string, userId: string): Promise<IMeetingEntity> {
        const meeting = await this.meetingRepo.getMeetingById(meetingId);
        if (!meeting) {
            throw new Error(MEETING_ERRORS.MEETING_NOT_FOUND);
        }

        const updatedMeeting = await this.meetingRepo.updateParticipantStatus(meetingId, userId, 'joined');
        if (!updatedMeeting) {
            throw new Error("Failed to join meeting: User not invited or meeting invalid");
        }

        return updatedMeeting;
    }
}
